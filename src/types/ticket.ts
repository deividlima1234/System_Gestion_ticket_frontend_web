import type { User } from './auth';

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketStatus = 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';

export interface Ticket {
    id: number;
    title: string;
    description: string;
    priority: TicketPriority;
    status: TicketStatus;
    user_id: number;
    assigned_to: number | null;
    created_at: string;
    updated_at: string;
    user?: User; // Creator
    assigned_user?: User; // Technician
}

export interface CreateTicketDTO {
    title: string;
    description: string;
    priority: TicketPriority;
}

export interface UpdateTicketDTO {
    status?: TicketStatus;
    assigned_to?: number;
    priority?: TicketPriority;
}

export interface Comment {
    id: number;
    content: string;
    user_id: number;
    ticket_id: number;
    created_at: string;
    updated_at: string;
    user?: User;
}
