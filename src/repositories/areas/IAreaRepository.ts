import { Area } from "../../types/Area";

export interface IAreaRepository {
    getAllAreas(): Promise<Area[]>;
    getAreaById(id: number): Promise<Area | null>;
    createArea(area: Omit<Area, "id_area">): Promise<Area>;
    updateArea(id: number, area: Partial<Area>): Promise<Area | null>;
    deleteArea(id: number): Promise<boolean>;
}