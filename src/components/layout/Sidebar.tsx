import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { LogOut, LayoutDashboard, Ticket, User, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';

export const Sidebar = () => {
    const { logout, user } = useAuth();
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Ticket, label: 'Tickets', path: '/tickets' },
        { icon: User, label: 'Mi Perfil', path: '/profile' },
    ];

    if (user?.role === 'admin') {
        navItems.push({ icon: Users, label: 'Usuarios', path: '/users' });
    }

    return (
        <div className="w-64 bg-dark-surface border-r border-dark-border flex flex-col">
            <div className="p-6 border-b border-dark-border">
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-8 bg-primary rounded-full"></span>
                    TicketSys <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded border border-primary/20">V1</span>
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={clsx(
                            'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                            location.pathname === item.path
                                ? 'bg-primary/10 text-primary border border-primary/20'
                                : 'text-light-muted hover:bg-dark-border hover:text-white'
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-dark-border">
                <div className="mb-4 px-2">
                    <p className="text-sm text-white font-medium truncate">{user?.name || 'Usuario'}</p>
                    <p className="text-xs text-light-muted truncate">{user?.email || 'user@example.com'}</p>
                </div>
                <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={logout}>
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                </Button>
            </div>
        </div>
    );
};
