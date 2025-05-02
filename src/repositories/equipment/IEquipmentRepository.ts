import { Equipment } from "../../types/Equipment";

export interface IEquipmentRepository {
  getAll(): Promise<Equipment[]>;
  getById(id: number): Promise<Equipment | null>;
  create(equipment: Omit<Equipment, "id_state">): Promise<Equipment>;
  update(id: number, equipment: Omit<Equipment, "id_state">): Promise<Equipment>;
  delete(id: number): Promise<boolean>;
}
