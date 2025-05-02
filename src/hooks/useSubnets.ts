import { useState } from "react";
import { Subnet } from "../types/Subnet";
import { SubnetRepository } from "../repositories/subnets/SubnetReository";

export const useSubnets = () => {
  const [subnets, setSubnets] = useState<Subnet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAllSubnets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await new SubnetRepository().getAllSubnets();
      setSubnets(data);
    } catch (err: any) {
      setError(err.message || "Error al obtener subredes");
    } finally {
      setLoading(false);
    }
  };

  return {
    subnets,
    loading,
    error,
    getAllSubnets,
  };
};
