import { ITicketRepository } from "./ITicketRepository";
import { Ticket } from "../../types/Ticket";

const API_URL = import.meta.env.VITE_API_TICKET;

export class TicketRepository implements ITicketRepository {
    async getAllTickets(): Promise<Ticket[]> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Error fetching tickets');
            const json = await response.json();
            return json.getAllTickets || [];
        } catch (error) {
            console.log('Error fetching tickets:', error);
            return [];
        }
    }

    async getTicketById(id: number): Promise<Ticket | null> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Ticket not found');
            const json = await response.json();
            return json.ticket || [];
        } catch (error) {
            console.log('Ticket not found:', error);
            return null;
        }
    }

    async createTicket(ticket: Omit<Ticket, "id_ticket" | "folio" | "creation_date" | "sede" | "division" | "building" | "floor_" | "classroom" | "name_technical" | "last_name_technical" | "contact">): Promise<Ticket> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(ticket),
            });
            if (!response.ok) throw new Error('Error creating ticket');
            return await response.json();
        } catch (error) {
            console.log('Error creating ticket:', error);
            throw error;
        }
    }

    async updateTicket(id: number, ticket: Partial<Ticket>): Promise<Ticket | null> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(ticket),
            });
            if (!response.ok) throw new Error('Error updating ticket');
            return await response.json();
        } catch (error) {
            console.log('Error updating ticket:', error);
            return null;
        }
    }

    async deleteTicket(id: number): Promise<boolean> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            return response.ok;
        } catch (error) {
            console.log('Error deleting ticket:', error);
            return false;
        }
    }
}