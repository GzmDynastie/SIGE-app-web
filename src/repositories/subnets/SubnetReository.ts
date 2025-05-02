import { ISubnetRepository } from "./ISubnetRepository";
import { Subnet } from "../../types/Subnet";

const API_URL = import.meta.env.VITE_API_SUBNET;

export class SubnetRepository implements ISubnetRepository {
    async getAllSubnets(): Promise<Subnet[]> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Error fetching subnets');
            
            const json = await response.json();
            return json.getAllSubnets || [];
            
        } catch (error) {
            console.log('Error fetching subnets:', error);
            return [];
        }
    }

    async getSubnetById(id: number): Promise<Subnet | null> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Subnet not found');
            return await response.json();
        } catch (error) {
            console.log('Subnet not found:', error);
            return null;
        }
    }

    async createSubnet(subnet: Omit<Subnet, "id">): Promise<Subnet> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(subnet),
            });
            if (!response.ok) throw new Error('Error creating subnet');
            return await response.json();
        } catch (error) {
            console.log('Error creating subnet:', error);
            throw error;
        }
    }

    async updateSubnet(id: number, subnet: Partial<Subnet>): Promise<Subnet | null> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                 },
                body: JSON.stringify(subnet),
            });
            if (!response.ok) throw new Error('Error updating subnet');
            return await response.json();
        } catch (error) {
            console.log('Error updating subnet:', error);
            return null;
        }
    }

    async deleteSubnet(id: number): Promise<boolean> {
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
            console.log('Error deleting subnet:', error);
            return false;
        }
    }
}
