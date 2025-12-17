
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ticketService } from '../../services/ticketService';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { TicketStatusBadge } from './TicketStatusBadge';
import { TicketPriorityBadge } from './TicketPriorityBadge';
import { Skeleton } from '../ui/Skeleton';
import { Link } from 'react-router-dom';
import { Calendar, User as UserIcon } from 'lucide-react';

export const TicketList = () => {
    const { user } = useAuth();
    const [showHistory, setShowHistory] = useState(false);

    const { data: tickets, isLoading: isTicketsLoading, isError } = useQuery({
        queryKey: ['tickets'],
        queryFn: ticketService.getTickets,
    });

    const { data: users } = useQuery({
        queryKey: ['users'],
        queryFn: userService.getUsers,
        enabled: user?.role === 'admin',
    });

    const getUserName = (userId: number) => {
        if (user && user.id === userId) return user.name;
        return users?.find(u => u.id === userId)?.name || 'Usuario';
    };

    const isToday = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isAdmin = user?.role === 'admin';
    const isSupport = user?.role === 'support';

    // Filter logic
    const filteredTickets = tickets?.filter(ticket => {
        // Support restriction: Can ONLY see assigned tickets
        if (isSupport && ticket.assigned_to !== user?.id) {
            return false;
        }

        if (ticket.status !== 'closed') return true;

        // Closed tickets
        if (isAdmin) {
            // Admin sees closed if "Show History" is on OR if it's from today
            return showHistory || isToday(ticket.updated_at);
        }

        // Non-admin sees closed ONLY if it's from today (Backend filters older ones too, but good to be safe)
        return isToday(ticket.updated_at);
    });

    const handleTicketClick = (e: React.MouseEvent, ticket: any) => {
        if (ticket.status === 'closed' && !isAdmin) {
            e.preventDefault();
            alert("Este ticket ha sido cerrado y archivado. Contacte a un administrador si necesita reabrirlo.");
        }
    };

    const isLoading = isTicketsLoading;

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-dark-surface border border-dark-border rounded-lg p-6 space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2 w-2/3">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                        <div className="flex gap-4">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center p-8 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400">Error al cargar los tickets. Por favor intente de nuevo.</p>
            </div>
        );
    }

    if (!filteredTickets || filteredTickets.length === 0) {
        return (
            <div className="space-y-4">
                {isAdmin && (
                    <div className="flex justify-end mb-4">
                        <label className="flex items-center gap-2 text-sm text-light-muted cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={showHistory}
                                onChange={(e) => setShowHistory(e.target.checked)}
                                className="rounded border-dark-border bg-dark-surface text-primary focus:ring-primary"
                            />
                            Mostrar Historial Completo
                        </label>
                    </div>
                )}
                <div className="text-center p-12 bg-dark-surface border border-dark-border rounded-lg">
                    <p className="text-light-muted">No se encontraron tickets.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {isAdmin && (
                <div className="flex justify-end mb-4">
                    <label className="flex items-center gap-2 text-sm text-light-muted cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={showHistory}
                            onChange={(e) => setShowHistory(e.target.checked)}
                            className="rounded border-dark-border bg-dark-surface text-primary focus:ring-primary"
                        />
                        Mostrar Historial Completo
                    </label>
                </div>
            )}

            {filteredTickets?.map((ticket) => (
                <Link
                    key={ticket.id}
                    to={`/tickets/${ticket.id}`}
                    onClick={(e) => handleTicketClick(e, ticket)}
                    className={`block bg-dark-surface border border-dark-border rounded-lg p-6 transition-colors group ${ticket.status === 'closed' && !isAdmin ? 'opacity-75 cursor-not-allowed hover:border-dark-border' : 'hover:border-primary/50'
                        }`}
                >
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h3 className={`text-lg font-semibold text-white transition-colors ${ticket.status === 'closed' && !isAdmin ? '' : 'group-hover:text-primary'
                                }`}>
                                {ticket.title}
                            </h3>
                            <p className="text-light-muted text-sm mt-1 line-clamp-2">
                                {ticket.description}
                            </p>
                        </div>
                        <TicketStatusBadge status={ticket.status} />
                    </div>

                    <div className="flex items-center gap-6 text-sm text-light-muted mt-4">
                        <TicketPriorityBadge priority={ticket.priority} />

                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <UserIcon className="w-4 h-4" />
                            <span>{ticket.user?.name || getUserName(ticket.user_id)}</span>
                        </div>
                    </div>
                </Link>
            ))}

            {filteredTickets?.length === 0 && (
                <div className="text-center p-12 bg-dark-surface border border-dark-border rounded-lg">
                    <p className="text-light-muted">No se encontraron tickets.</p>
                </div>
            )}
        </div>
    );
};
