import { useState } from "react";
import { Area } from "../types/Area";
import { AreaRepository } from "../repositories/areas/AreaRepository";
import { Equipment } from "../types/Equipment";

const areaRepository = new AreaRepository();

export function useAreas() {
    const [areas, setAreas] = useState<Area[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedArea, setSelectedArea] = useState<Area | null>(null);
    const [selectedEquipmentArea, setEquipmentSelectedArea] = useState<Equipment[]>([]);


    async function getAllAreas() {
        setLoading(true);
        setError(null);
        try {
            const data = await areaRepository.getAllAreas();
            setAreas(data);
        } catch (err) {
            setError('Error loading areas');
        } finally {
            setLoading(false)
        }
    }

    async function getAreaById(id: number): Promise<Area | null> {
        setLoading(true);
        setError(null);
        try {
            const area = await areaRepository.getAreaById(id);
            setSelectedArea(area);
            return area;
        } catch (err) {
            setError('Error getting area');
            return null;
        } finally {
            setLoading(false)
        }
    }

    async function getEquipmentAreaById(id: number): Promise<Equipment []| null> {
        setLoading(true);
        setError(null);
        try {
            const equipment = await areaRepository.getEquipmentAreaById(id);
            setEquipmentSelectedArea(equipment);
            return equipment;
        } catch (err) {
            setError('Error getting equipment');
            return null;
        } finally {
            setLoading(false)
        }
    }

    // async function createArea(area: Omit<Area, "id_area" | "status">) {
    //     setLoading(true);
    //     setError(null);
    //     try {
    //         const newArea = await areaRepository.createArea(area);
    //         setAreas((prev) => [...prev, newArea]);
    //     } catch (err) {
    //         setError('Error creating area');
    //     } finally {
    //         setLoading(false)
    //     }
    // }
    async function createArea(area: Omit<Area, "id_area" | "status">) {
        setLoading(true);
        setError(null);
        
        try {
            const newArea = await areaRepository.createArea(area);
            setAreas((prev) => [...prev, newArea]);
            return { success: true, data: newArea };
        } catch (err) {
            // Manejo específico de diferentes tipos de errores
            let errorMessage = 'Error creating area';
            
            if (err instanceof Error) {
                if (err.message.includes('already exists')) {
                    errorMessage = 'El aula/laboratorio ya existe. Por favor, use un valor diferente.';
                } else if (err.message.includes('validation')) {
                    errorMessage = 'Datos inválidos. Verifique los campos.';
                } else {
                    errorMessage = err.message || errorMessage;
                }
            }
            
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }

    async function updatedArea(id: number, area: Omit<Area, "id_area" | "status">) {
        setLoading(true);
        setError(null);
        try {
            const updatedArea = await areaRepository.updateArea(id, area);
            if (updatedArea) {
                setAreas((prev) =>
                    prev.map((a) => (a.id_area === id ? updatedArea : a))
                );
            }
        } catch (err) {
            setError('Error updating area');
        } finally {
            setLoading(false)
        }
    }

    async function deleteArea(id: number) {
        setLoading(true);
        setError(null);
        try {
            const success = await areaRepository.deleteArea(id);
            if (success) {
                setAreas((prev) => prev.filter((a) => a.id_area !== id));
            }
        } catch (err) {
            setError('Error deleting area');
        } finally {
            setLoading(false)
        }
    }

    return {
        areas,
        loading,
        error,
        selectedArea,
        selectedEquipmentArea,
        getAllAreas,
        getAreaById,
        getEquipmentAreaById,
        createArea,
        updatedArea,
        deleteArea
    }
}