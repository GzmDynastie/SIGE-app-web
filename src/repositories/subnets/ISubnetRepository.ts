import { Subnet } from "../../types/Subnet";

export interface ISubnetRepository {
    getAllSubnets(): Promise<Subnet[]>;
    getSubnetById(id: number): Promise<Subnet | null>;
    createSubnet(subnet: Omit<Subnet, "id">): Promise<Subnet>;
    updateSubnet(id: number, subnet: Partial<Subnet>): Promise<Subnet | null>;
    deleteSubnet(id: number): Promise<boolean>;
}
