import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../services/dashboardService';
import type { DashboardStats } from '../types/dashboard';
import { StatsCard } from '../components/dashboard/StatsCard';
import { Users, Ticket, CheckCircle, Clock, AlertCircle, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/format';
import { cn } from '../utils/cn';

export const DashboardPage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-light-muted mt-1">Bienvenido de nuevo, {user?.name}</p>
                </div>
                {user?.role === 'user' && (
                    <Link to="/tickets/new" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        Nuevo Ticket
                    </Link>
                )}
            </div>

            {/* Admin View */}
            {user?.role === 'admin' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard title="Total Usuarios" value={stats.total_users || 0} icon={Users} color="info" />
                    <StatsCard title="Total Tickets" value={stats.total_tickets || 0} icon={Ticket} color="primary" />
                    <StatsCard title="Tickets Abiertos" value={stats.tickets_open || 0} icon={AlertCircle} color="danger" />
                    <StatsCard title="En Progreso" value={stats.tickets_in_progress || 0} icon={Clock} color="warning" />
                </div>
            )}

            {/* Support View */}
            {(user?.role === 'support' || user?.role === 'admin') && stats.assigned_tickets !== undefined && (
                <>
                    <h2 className="text-xl font-bold text-white mt-8 mb-4">Mi Productividad</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatsCard title="Asignados a mí" value={stats.assigned_tickets || 0} icon={Briefcase} color="warning" />
                        <StatsCard title="Resueltos Hoy" value={stats.resolved_tickets_today || 0} icon={CheckCircle} color="success" />
                        <StatsCard title="Sin Asignar (Global)" value={stats.unassigned_tickets || 0} icon={AlertCircle} color="danger" />
                    </div>
                </>
            )}

            {/* User View */}
            {user?.role === 'user' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatsCard title="Mis Tickets Abiertos" value={stats.my_open_tickets || 0} icon={Ticket} color="warning" />
                    <StatsCard title="Mis Tickets Cerrados" value={stats.my_closed_tickets || 0} icon={CheckCircle} color="success" />
                </div>
            )}

            {/* Recent Tickets Section (Shared) */}
            <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Actividad Reciente</h2>
                {stats.recent_tickets && stats.recent_tickets.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-dark-border text-light-muted text-sm">
                                    <th className="pb-3 pl-2">ID</th>
                                    <th className="pb-3">Asunto</th>
                                    <th className="pb-3">Estado</th>
                                    <th className="pb-3">Prioridad</th>
                                    <th className="pb-3">Fecha</th>
                                    <th className="pb-3">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-border/50">
                                {stats.recent_tickets.map((ticket) => (
                                    <tr key={ticket.id} className="text-sm hover:bg-white/5 transition-colors">
                                        <td className="py-4 pl-2 font-mono text-primary">#{ticket.id}</td>
                                        <td className="py-4 text-white font-medium">{ticket.title}</td>
                                        <td className="py-4">
                                            <span className={cn(
                                                "px-2 py-1 rounded text-xs font-medium border",
                                                ticket.status === 'open' && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                                                ticket.status === 'in_progress' && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                                                ticket.status === 'resolved' && "bg-green-500/10 text-green-500 border-green-500/20",
                                                ticket.status === 'closed' && "bg-gray-500/10 text-gray-500 border-gray-500/20",
                                                ticket.status === 'pending' && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                            )}>
                                                {ticket.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <span className={cn(
                                                "px-2 py-1 rounded text-xs font-medium",
                                                ticket.priority === 'critical' && "text-red-400",
                                                ticket.priority === 'high' && "text-orange-400",
                                                ticket.priority === 'medium' && "text-blue-400",
                                                ticket.priority === 'low' && "text-gray-400"
                                            )}>
                                                {ticket.priority.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-4 text-light-muted">{formatDate(ticket.created_at)}</td>
                                        <td className="py-4">
                                            <Link to={`/tickets/${ticket.id}`} className="text-primary hover:text-primary-light hover:underline">
                                                Ver Detalle
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-light-muted">
                        <p>No hay actividad reciente para mostrar.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
