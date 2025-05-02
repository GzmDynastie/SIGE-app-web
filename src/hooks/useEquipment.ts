import { useState, useCallback } from "react";
import { Equipment } from "../types/Equipment";
import { EquipmentRepository } from "../repositories/equipment/EquipmentRepository";

export const useEquipment = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const equipmentRepository = new EquipmentRepository();

  const fetchEquipment = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await equipmentRepository.getAll();
      setEquipment(data);
    } catch (err) {
      setError('Error fetching equipment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [equipmentRepository]);

  const fetchEquipmentById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await equipmentRepository.getById(id); 
      return data;
    } catch (err) {
      setError('Error fetching equipment by ID');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [equipmentRepository]);

  const createEquipment = useCallback(async (equipmentData: Omit<Equipment, "id_state">) => {
    setLoading(true);
    setError(null);
    try {
      await equipmentRepository.create(equipmentData); // Crear un equipo
      await fetchEquipment(); // Volver a cargar los equipos después de la creación
    } catch (err) {
      setError('Error creating equipment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [equipmentRepository, fetchEquipment]);

  const updateEquipment = useCallback(async (id: number, equipmentData: Omit<Equipment, "id_state">) => {
    setLoading(true);
    setError(null);
    try {
      await equipmentRepository.update(id, equipmentData); // Actualizar un equipo
      await fetchEquipment(); // Volver a cargar los equipos después de la actualización
    } catch (err) {
      setError('Error updating equipment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [equipmentRepository, fetchEquipment]);

  const deleteEquipment = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await equipmentRepository.delete(id); // Eliminar un equipo
      await fetchEquipment(); // Volver a cargar los equipos después de la eliminación
    } catch (err) {
      setError('Error deleting equipment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [equipmentRepository, fetchEquipment]);

  return {
    equipment,
    loading,
    error,
    fetchEquipment,
    fetchEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment
  };
};
