import { Ticket } from "../../types/Ticket";

export interface ITicketRepository {
    getAllTickets(): Promise<Ticket[]>;
    getTicketById(id: number): Promise<Ticket | null>;
    createTicket(ticket: Omit<Ticket, "id_ticket">): Promise<Ticket>;
    updateTicket(id: number, ticket: Partial<Ticket>): Promise<Ticket | null>;
    deleteTicket(id: number): Promise<boolean>;
}