import type { Ticket } from '../../types/ticket';
import { TicketStatusBadge } from './TicketStatusBadge';
import { TicketPriorityBadge } from './TicketPriorityBadge';
import { Calendar, User, Clock } from 'lucide-react';

interface TicketDetailProps {
    ticket: Ticket;
    creatorName?: string;
}

export const TicketDetail = ({ ticket, creatorName }: TicketDetailProps) => {
    return (
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6 space-y-6">
            <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-white">{ticket.title}</h1>
                <TicketStatusBadge status={ticket.status} />
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-light-muted border-b border-dark-border pb-6">
                <div className="flex items-center gap-2">
                    <TicketPriorityBadge priority={ticket.priority} />
                </div>
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Creado por: <span className="text-white">{creatorName || ticket.user?.name || 'Usuario'}</span></span>
                </div>
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
