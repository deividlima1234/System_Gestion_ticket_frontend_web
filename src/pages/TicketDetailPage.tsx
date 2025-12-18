

import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '../services/ticketService';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { TicketDetail } from '../components/tickets/TicketDetail';
import { CommentList } from '../components/comments/CommentList';
import { AddCommentForm } from '../components/comments/AddCommentForm';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { ArrowLeft } from 'lucide-react';

export const TicketDetailPage = () => {
    const { user } = useAuth();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const ticketId = Number(id);
    const queryClient = useQueryClient();

    const { data: ticket, isLoading: isTicketLoading, error } = useQuery({
        queryKey: ['ticket', ticketId],
        queryFn: () => ticketService.getTicket(ticketId),
        enabled: !!ticketId,
        retry: false, // Don't retry if it's a 403
    });

    const { data: users } = useQuery({
        queryKey: ['users'],
        queryFn: userService.getUsers,
        enabled: user?.role === 'admin',
    });

    const { data: supportUsers } = useQuery({
        queryKey: ['supportUsers'],
        queryFn: async () => {
            const allUsers = await userService.getUsers();
            return allUsers.filter(u => u.role === 'support');
        },
        enabled: user?.role === 'admin',
    });

    const creatorName = (user && ticket && user.id === ticket.user_id)
        ? user.name
        : users?.find(u => u.id === ticket?.user_id)?.name;

    const { data: comments } = useQuery({
        queryKey: ['comments', ticketId],
        queryFn: () => ticketService.getComments(ticketId),
        enabled: !!ticketId,
    });

    const updateStatusMutation = useMutation({
        mutationFn: (status: any) => ticketService.updateTicket(ticketId, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
        },
    });

    const assignMutation = useMutation({
        mutationFn: (userId: number) => ticketService.assignTicket(ticketId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
        },
    });

    if (isTicketLoading) {
        return (
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Back button skeleton */}
                <Skeleton className="h-4 w-32" />

                <div className="bg-dark-surface border border-dark-border rounded-lg p-8 shadow-xl">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-64" />
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                        <Skeleton className="h-8 w-24 rounded-full" />
                    </div>

                    {/* Description */}
                    <div className="space-y-2 mb-8">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>

                    {/* Controls */}
                    <div className="flex flex-wrap gap-4 pt-6 border-t border-dark-border mb-8">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-10 w-64" />
                    </div>

                    {/* Footer */}
                    <div className="flex gap-6 pt-6 border-t border-dark-border">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
            </div>
        );
    }


    // Handle 403 Forbidden (or other errors)
    if (error) {
        const isForbidden = (error as any)?.response?.status === 403;

        return (
            <div className="text-center py-12 max-w-2xl mx-auto">
                <div className="bg-dark-surface border border-dark-border rounded-lg p-8 shadow-xl">
                    <h2 className="text-xl font-bold text-white mb-4">
                        {isForbidden ? 'Ticket Archivado' : 'Error'}
                    </h2>
                    <p className="text-light-muted mb-6">
                        {isForbidden
                            ? 'Este ticket ha sido cerrado y archivado. Contacte a un administrador si necesita reabrirlo.'
                            : 'Hubo un error al cargar el ticket.'}
                    </p>
                    <Button variant="ghost" onClick={() => navigate('/tickets')}>
                        Volver a la lista
                    </Button>
                </div>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="text-center py-12">
                <p className="text-light-muted">Ticket no encontrado.</p>
                <Button variant="ghost" onClick={() => navigate('/tickets')} className="mt-4">
                    Volver a la lista
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Button variant="ghost" onClick={() => navigate('/tickets')} className="pl-0 hover:bg-transparent hover:text-white">
                <ArrowLeft className="w-4 h-4" />
                Volver a Tickets
            </Button>

            <TicketDetail
                ticket={ticket}
                creatorName={creatorName}
                supportUsers={supportUsers}
                onStatusChange={(status) => updateStatusMutation.mutate(status)}
                onAssign={(userId) => assignMutation.mutate(userId)}
                isUpdating={updateStatusMutation.isPending || assignMutation.isPending}
            />

            <div className="border-t border-dark-border pt-8">
                <h3 className="text-xl font-bold text-white mb-6">Comentarios</h3>
                <div className="space-y-8">
                    <CommentList comments={comments || []} />
                    <AddCommentForm ticketId={ticketId} />
                </div>
            </div>
        </div>
    );
};
