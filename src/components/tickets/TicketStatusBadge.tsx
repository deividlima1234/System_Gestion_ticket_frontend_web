import type { TicketStatus } from '../../types/ticket';
import { cn } from '../../utils/cn';

interface TicketStatusBadgeProps {
    status: TicketStatus;
}

const statusConfig: Record<TicketStatus, { label: string; className: string }> = {
    open: { label: 'Abierto', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    in_progress: { label: 'En Proceso', className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
    pending: { label: 'Pendiente', className: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
    resolved: { label: 'Resuelto', className: 'bg-green-500/10 text-green-400 border-green-500/20' },
    closed: { label: 'Cerrado', className: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
};

export const TicketStatusBadge = ({ status }: TicketStatusBadgeProps) => {
    const config = statusConfig[status] || statusConfig.open;

    return (
        <span className={cn(
            "px-2.5 py-0.5 rounded-full text-xs font-medium border",
            config.className
        )}>
            {config.label}
        </span>
    );
};
