import api from './api';
import type { Ticket, CreateTicketDTO, UpdateTicketDTO, Comment } from '../types/ticket';

export const ticketService = {
    getTickets: async (): Promise<Ticket[]> => {
        const response = await api.get('/tickets');
        // The API might return { data: [...] } or just [...] depending on Laravel resource wrapping.
        // Standard Laravel Resources usually wrap in 'data'.
        // Based on user curl example: `curl -X GET ...` -> Response not fully shown but usually it's array or data object.
        // I'll assume it returns the array directly or I'll handle the 'data' property if it exists.
        return response.data.data || response.data;
    },

    getTicket: async (id: number): Promise<Ticket> => {
        const response = await api.get(`/tickets/${id}`);
        return response.data.data || response.data;
    },

    createTicket: async (data: CreateTicketDTO): Promise<Ticket> => {
        const response = await api.post('/tickets', data);
        return response.data.data || response.data;
    },

    updateTicket: async (id: number, data: UpdateTicketDTO): Promise<Ticket> => {
        const response = await api.put(`/tickets/${id}`, data);
        return response.data.data || response.data;
    },

    assignTicket: async (id: number, userId: number): Promise<Ticket> => {
        const response = await api.put(`/tickets/${id}/assign`, { assigned_to: userId });
        return response.data.data || response.data;
    },

    addComment: async (id: number, content: string): Promise<Comment> => {
        const response = await api.post(`/tickets/${id}/comments`, { content });
        return response.data.data || response.data;
    },

    getComments: async (id: number): Promise<Comment[]> => {
        // Assuming there's an endpoint to get comments or they come with the ticket.
        // If not, we might need to check the API docs again. 
        // The user didn't specify a "List Comments" endpoint, but usually it's included in the ticket detail or a separate endpoint.
        // I'll assume for now they are included in the ticket detail or I'll try to fetch them if needed.
        // Let's add a specific endpoint fetch just in case standard REST conventions apply.
        const response = await api.get(`/tickets/${id}/comments`);
        return response.data.data || response.data;
    }
};
