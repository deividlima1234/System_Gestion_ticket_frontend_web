import React from 'react';
import type { TicketPriority } from '../../types/ticket';
import { cn } from '../../utils/cn';
import { AlertCircle, AlertTriangle, ArrowDown, ArrowUp } from 'lucide-react';

interface TicketPriorityBadgeProps {
    priority: TicketPriority;
}

const priorityConfig: Record<TicketPriority, { label: string; className: string; icon: React.ElementType }> = {
    low: { label: 'Baja', className: 'text-gray-400', icon: ArrowDown },
    medium: { label: 'Media', className: 'text-blue-400', icon: ArrowUp },
    high: { label: 'Alta', className: 'text-orange-400', icon: AlertTriangle },
    critical: { label: 'Crítica', className: 'text-red-500', icon: AlertCircle },
};

export const TicketPriorityBadge = ({ priority }: TicketPriorityBadgeProps) => {
    const config = priorityConfig[priority] || priorityConfig.medium;
    const Icon = config.icon;

    return (
        <div className={cn("flex items-center gap-1.5", config.className)}>
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{config.label}</span>
        </div>
    );
};
