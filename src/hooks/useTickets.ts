import { useState } from "react";
import { Ticket } from "../types/Ticket";
import { TicketRepository } from "../repositories/tickets/TicketRepository";

const ticketRepository = new TicketRepository();

export function useTickets() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    async function getAllTickets() {
        setLoading(true);
        setError(null);
        try {
            const data = await ticketRepository.getAllTickets();
            setTickets(data);
        } catch (err) {
            setError('Error loading ticket');
        } finally {
            setLoading(false);
        }
    }

    async function getTicketById(id: number): Promise<Ticket | null> {
        setLoading(true);
        setError(null);
        try {
            const ticket = await ticketRepository.getTicketById(id);
            setSelectedTicket(ticket);
            return ticket;
        } catch (err) {
            setError('Error getting ticket')
            return null;
        } finally {
            setLoading(false);
        }
    }

    async function createTicket(ticket: Omit<Ticket, "id_ticket" | "folio" | "creation_date" | "sede" | "division" | "building" | "floor_" | "classroom" | "name_technical" | "last_name_technical" | "contact">) {
        setLoading(true);
        setError(null);
        try {
            const newTicket = await ticketRepository.createTicket(ticket);
            setTickets((prev) => [...prev, newTicket]);
        } catch (err) {
            setError('Error creating ticket');
        } finally {
            setLoading(false);
        }
    }

    async function updateTicket(id: number, ticket: Partial<Ticket>) {
        setLoading(true);
        setError(null);
        try {
            const updatedTicket = await ticketRepository.updateTicket(id, ticket);
            if (updatedTicket) {
                setTickets((prev) =>
                    prev.map((t) => (t.id_ticket === id ? updatedTicket : t))
                );
            }
        } catch (err) {
            setError('Error updating ticket');
        } finally {
            setLoading(false);
        }
    }

    async function deleteTicket(id: number) {
        setLoading(true);
        setError(null);
        try {
            const success = await ticketRepository.deleteTicket(id);
            if (success) {
                setTickets((prev) => prev.filter((t) => t.id_ticket !== id));
            }
        } catch (err) {
            setError('Error deleting ticket');
        } finally {
            setLoading(false);
        }
    }

    return {
        tickets,
        selectedTicket,
        loading,
        error,
        getAllTickets,
        getTicketById,
        createTicket,
        updateTicket,
        deleteTicket
    };
}