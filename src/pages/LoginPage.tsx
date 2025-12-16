import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { profileService } from '../services/profileService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Lock, Mail, ShieldCheck } from 'lucide-react';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Clear any existing token before attempting login
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            const response = await api.post('/login', { email, password });
            // The API returns { access_token: "...", token_type: "Bearer" }
            // It does NOT return the user object based on the documentation provided.
            // We will store the token and then fetch the user profile or just redirect.
            // For now, let's assume we can proceed with just the token.

            const { access_token } = response.data;

            // Temporarily set token to allow profile fetch
            localStorage.setItem('token', access_token);

            try {
                const user = await profileService.getProfile();
                login(access_token, user);
            } catch (error) {
                console.error('Error fetching profile:', error);
                // Fallback: login without user data (will try to fetch in context or show default)
                login(access_token);
            }

            navigate('/dashboard');
        } catch (err: any) {
            console.error('Login failed', err);
            setError('Credenciales inválidas. Por favor intente de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-md z-10 p-4">
                <div className="bg-dark-surface/80 backdrop-blur-xl border border-dark-border rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 border border-primary/20">
                            <ShieldCheck className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Bienvenido de nuevo</h1>
                        <p className="text-light-muted">Sistema de Gestión de Tickets V1</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-light-muted" />
                                <Input
                                    type="email"
                                    placeholder="nombre@empresa.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-light-muted" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full py-3" isLoading={isLoading}>
                            Iniciar Sesión
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-light-muted">
                        <p>¿Olvidaste tu contraseña? Contacta a soporte.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
