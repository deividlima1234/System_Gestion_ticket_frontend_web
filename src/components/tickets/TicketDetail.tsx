import { useAuth } from '../../context/AuthContext';
import { Select } from '../ui/Select';
import type { Ticket, TicketStatus } from '../../types/ticket';
import type { User as UserType } from '../../types/auth'; // Alias to avoid conflict with lucide-react User
import { TicketStatusBadge } from './TicketStatusBadge';
import { TicketPriorityBadge } from './TicketPriorityBadge';
import { Calendar, User, Clock } from 'lucide-react';

interface TicketDetailProps {
    ticket: Ticket;
    creatorName?: string;
    supportUsers?: UserType[];
    onStatusChange?: (status: TicketStatus) => void;
    onAssign?: (userId: number) => void;
    isUpdating?: boolean;
}

export const TicketDetail = ({
    ticket,
    creatorName,
    supportUsers = [],
    onStatusChange,
    onAssign,
    isUpdating = false
}: TicketDetailProps) => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const isSupport = user?.role === 'support';
    const canUpdateStatus = isAdmin || isSupport;
    const canAssign = isAdmin;

    const statusOptions: { value: TicketStatus; label: string }[] = [
        { value: 'open', label: 'Abierto' },
        { value: 'in_progress', label: 'En Proceso' },
        { value: 'pending', label: 'Pendiente' },
        { value: 'resolved', label: 'Resuelto' },
        { value: 'closed', label: 'Cerrado' },
    ];

    return (
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                    <h1 className="text-2xl font-bold text-white">{ticket.title}</h1>
                    <div className="flex items-center gap-2">
                        <TicketStatusBadge status={ticket.status} />
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full md:w-auto min-w-[200px]">
                    {canUpdateStatus && onStatusChange && (
                        <Select
                            label="Cambiar Estado"
                            value={ticket.status}
                            onChange={(e) => onStatusChange(e.target.value as TicketStatus)}
                            options={statusOptions}
                            disabled={isUpdating}
                            className="text-sm"
                        />
                    )}

                    {canAssign && onAssign && (
                        <Select
                            label="Asignar a Agente"
                            value={ticket.assigned_to?.toString() || ''}
                            onChange={(e) => onAssign(Number(e.target.value))}
                            options={[
                                { value: '', label: 'Sin asignar' },
                                ...supportUsers.map(u => ({ value: u.id.toString(), label: u.name }))
                            ]}
                            disabled={isUpdating}
                            className="text-sm"
                        />
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-light-muted border-b border-dark-border pb-6">
                <div className="flex items-center gap-2">
                    <TicketPriorityBadge priority={ticket.priority} />
                </div>
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Creado por: <span className="text-white">{creatorName || ticket.user?.name || 'Usuario'}</span></span>
                </div>
                {ticket.assigned_to && (
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        <span>Asignado a: <span className="text-white">
                            {supportUsers.find(u => u.id === ticket.assigned_to)?.name || 'Agente'}
                        </span></span>
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Actualizado: {new Date(ticket.updated_at).toLocaleDateString()}</span>
                </div>
            </div>

            <div className="prose prose-invert max-w-none">
                <h3 className="text-lg font-semibold text-white mb-2">Descripción</h3>
                <p className="text-gray-300 whitespace-pre-wrap">{ticket.description}</p>
            </div>
        </div>
    );
};
