import { Loan } from "../../types/Loan";

export interface ILoanRepository {
  // Obtener todos los préstamos
  getAll(): Promise<Loan[]>;

  // Obtener un préstamo por ID
  getById(id: number): Promise<Loan | null>;

  // Crear un préstamo (sin el campo "id_loan")
  create(data: Omit<Loan, "id_loan">): Promise<void>;

  // Actualizar un préstamo (sin el campo "id_loan")
  update(id: number, data: Omit<Loan, "id_loan">): Promise<void>;
}
