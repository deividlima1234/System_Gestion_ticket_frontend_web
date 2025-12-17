import { useAuth } from '../../context/AuthContext';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import type { Ticket, TicketStatus } from '../../types/ticket';
import type { User as UserType } from '../../types/auth';
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
    const isClosed = ticket.status === 'closed';

    // If closed, only Admin can reopen (change status to open)
    const showReopenOption = isClosed && isAdmin;

    const statusOptions: { value: TicketStatus; label: string }[] = [
        { value: 'open', label: 'Abierto' },
        { value: 'in_progress', label: 'En Proceso' },
        { value: 'pending', label: 'Pendiente' },
        { value: 'resolved', label: 'Resuelto' },
        { value: 'closed', label: 'Cerrado' },
    ];

    return (
        <div className="bg-dark-surface border border-dark-border rounded-lg p-8 shadow-xl">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">{ticket.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-light-muted">
                        <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {creatorName || 'Usuario'}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(ticket.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>
                <TicketStatusBadge status={ticket.status} />
            </div>

            {/* Description */}
            <div className="prose prose-invert max-w-none mb-8">
                <p className="text-light-text whitespace-pre-wrap">{ticket.description}</p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-dark-border mb-8">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-light-muted">Prioridad:</span>
                    <TicketPriorityBadge priority={ticket.priority} />
                </div>

                {/* Status Update Control */}
                {canUpdateStatus && !isClosed && (
                    <div className="w-48">
                        <Select
                            label="Estado"
                            value={ticket.status}
                            onChange={(e) => onStatusChange?.(e.target.value as any)}
                            disabled={isUpdating}
                            options={statusOptions}
                        />
                    </div>
                )}

                {/* Reopen Control for Admin */}
                {showReopenOption && (
                    <div className="flex items-end">
                        <Button
                            onClick={() => onStatusChange?.('open')}
                            isLoading={isUpdating}
                            variant="outline"
                            className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                        >
                            Reabrir Ticket
                        </Button>
                    </div>
                )}

                {/* Assignment Control */}
                {canAssign && !isClosed && (
                    <div className="w-64">
                        <Select
                            label="Agente Asignado"
                            value={ticket.assigned_to?.toString() || ''}
                            onChange={(e) => onAssign?.(Number(e.target.value))}
                            options={[
                                { value: '', label: 'Sin asignar' },
                                ...supportUsers.map(u => ({ value: u.id.toString(), label: u.name }))
                            ]}
                            disabled={isUpdating}
                            className="text-sm"
                        />
                    </div>
                )}
            </div>

            {/* Metadata Footer */}
            <div className="flex flex-wrap gap-6 text-sm text-light-muted border-t border-dark-border pt-6">
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
                    <Clock className="w-4 h-4" />
                    <span>Actualizado: {new Date(ticket.updated_at).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
};
