
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

    if (!tickets || tickets.length === 0) {
        return (
            <div className="text-center p-12 bg-dark-surface border border-dark-border rounded-lg">
                <p className="text-light-muted">No hay tickets registrados.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {tickets.map((ticket) => (
                <Link
                    key={ticket.id}
                    to={`/tickets/${ticket.id}`}
                    className="block bg-dark-surface border border-dark-border rounded-lg p-6 hover:border-primary/50 transition-colors group"
                >
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
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
        </div>
    );
};
