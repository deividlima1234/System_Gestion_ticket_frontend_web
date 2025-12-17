
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '../services/ticketService';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { TicketDetail } from '../components/tickets/TicketDetail';
import { CommentList } from '../components/comments/CommentList';
import { AddCommentForm } from '../components/comments/AddCommentForm';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Loader2 } from 'lucide-react';

export const TicketDetailPage = () => {
    const { user } = useAuth();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const ticketId = Number(id);
    const queryClient = useQueryClient();

    const { data: ticket, isLoading: isTicketLoading } = useQuery({
        queryKey: ['ticket', ticketId],
        queryFn: () => ticketService.getTicket(ticketId),
        enabled: !!ticketId,
    });

    // Fetch users only if the current user is an admin to display creator name
    const { data: users } = useQuery({
        queryKey: ['users'],
        queryFn: userService.getUsers,
        enabled: user?.role === 'admin',
    });

    // Fetch support users for assignment (only if admin)
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

    // Fetch comments separately if not included in ticket
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
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
