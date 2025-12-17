import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { profileService } from '../services/profileService';
import type { User } from '../types/auth';
import { SessionConflictModal } from '../components/auth/SessionConflictModal';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, user?: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const queryClient = useQueryClient();

    // Multi-tab management state
    const [isTabActive, setIsTabActive] = useState(true);
    const [tabId] = useState(() => Math.random().toString(36).substr(2, 9));

    // Auto-logout configuration (15 minutes)
    const AUTO_LOGOUT_TIME = 15 * 60 * 1000;

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        queryClient.removeQueries(); // Clear all cached data
        queryClient.clear(); // Clear mutation cache and others
    };

    // BroadcastChannel logic for multi-tab management
    useEffect(() => {
        const channel = new BroadcastChannel('auth_channel');

        channel.onmessage = (event) => {
            if (event.data.type === 'NEW_TAB_OPENED') {
                // Another tab opened, if we are active, we claim leadership to let them know
                if (isTabActive) {
                    channel.postMessage({ type: 'CLAIM_LEADERSHIP', tabId });
                }
            } else if (event.data.type === 'CLAIM_LEADERSHIP') {
                // Another tab claimed leadership, we must pause
                if (event.data.tabId !== tabId) {
                    setIsTabActive(false);
                }
            }
        };

        // Announce we are here when we mount (new tab)
        channel.postMessage({ type: 'NEW_TAB_OPENED', tabId });
        // New tab always starts as active (claiming leadership implicitly by being the latest)
        // But to be sure, we can claim it explicitly
        channel.postMessage({ type: 'CLAIM_LEADERSHIP', tabId });

        return () => {
            channel.close();
        };
    }, [tabId]);

    const handleClaimSession = () => {
        setIsTabActive(true);
        const channel = new BroadcastChannel('auth_channel');
        channel.postMessage({ type: 'CLAIM_LEADERSHIP', tabId });
        channel.close();
    };

    // Auto-logout logic (Only runs if tab is active)
    useEffect(() => {
        if (!token || !isTabActive) return;

        let timeoutId: ReturnType<typeof setTimeout>;

        const resetTimer = () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                console.log('Auto-logout due to inactivity');
                logout();
            }, AUTO_LOGOUT_TIME);
        };

        // Events to detect activity
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];

        // Initial timer start
        resetTimer();

        // Add event listeners
        events.forEach(event => {
            window.addEventListener(event, resetTimer);
        });

        // Cleanup
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            events.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [token, isTabActive]); // Re-run when token or active state changes

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
                // Try to fetch fresh user data
                try {
                    const fetchedUser = await profileService.getProfile();
                    setUser(fetchedUser);
                    localStorage.setItem('user', JSON.stringify(fetchedUser));
                } catch (error) {
                    console.error('Failed to fetch user profile on init', error);
                    // Fallback to stored user if available
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    }
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = (newToken: string, newUser?: User) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        if (newUser) {
            localStorage.setItem('user', JSON.stringify(newUser));
            setUser(newUser);
        }
        // When logging in, we claim session
        handleClaimSession();
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!token,
            isLoading,
            login,
            logout
        }}>
            {children}
            {!isTabActive && token && (
                <SessionConflictModal onClaimSession={handleClaimSession} />
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
