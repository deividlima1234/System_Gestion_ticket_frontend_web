import type { Ticket } from './ticket';

export interface DashboardStats {
    // Admin Fields
    total_users?: number;
    total_tickets?: number;
    tickets_open?: number;
    tickets_in_progress?: number;
    tickets_by_priority?: Record<string, number>;

    // Support Fields
    assigned_tickets?: number;
    resolved_tickets_today?: number;
    resolved_tickets_total?: number;
    unassigned_tickets?: number;
    urgent_assigned_tickets?: number;

    // User Fields
    my_open_tickets?: number;
    my_closed_tickets?: number;

    // Common/Shared
    recent_tickets?: Ticket[];
}
