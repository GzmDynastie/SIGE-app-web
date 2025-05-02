import { useEffect, useState } from "react";
import { Loan } from "../types/Loan";
import { Laboratory } from "../types/Laboratory";
import { LoanRepository } from "../repositories/loans/LoanRepository";

const loanRepository = new LoanRepository();

export function useLoans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLoans = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loanRepository.getAll();
      setLoans(data);
    } catch (err: any) {
      setError(err.message || "Error al obtener los préstamos");
    } finally {
      setLoading(false);
    }
  };

  const getLaboratories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loanRepository.getLaboratories();
      setLaboratories(data);
    } catch (err: any) {
      setError(err.message || "Error al obtener los laboratorios");
    } finally {
      setLoading(false);
    }
  };

  const getLoanById = async (id: number): Promise<Loan | null> => {
    try {
      const loan = await loanRepository.getById(id);
      return loan;
    } catch (err: any) {
      setError(err.message || "Error al obtener el préstamo");
      return null;
    }
  };

  const createLoan = async (loan: Omit<Loan, "id_loan">) => {
    try {
      await loanRepository.create(loan);
      await fetchLoans();
    } catch (err: any) {
      setError(err.message || "Error al crear el préstamo");
    }
  };

  const updateLoan = async (id: number, loan: Omit<Loan, "id_loan">) => {
    try {
      await loanRepository.update(id, loan);
      await fetchLoans();
    } catch (err: any) {
      setError(err.message || "Error al actualizar el préstamo");
    }
  };

  useEffect(() => {
    // Usamos Promise.all para esperar ambas solicitudes de datos
    const fetchData = async () => {
      await Promise.all([fetchLoans(), getLaboratories()]);
    };
    
    fetchData();
  }, []);

  return {
    loans,
    laboratories,
    loading,
    error,
    fetchLoans,
    getLoanById,
    createLoan,
    updateLoan,
    getLaboratories,
  };
}
