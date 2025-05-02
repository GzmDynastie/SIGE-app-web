export interface Loan {
  id_loan: number;
  id_fk_laboratory: number;
  id_in_charger: number;
  date_start: string;
  date_end: string;
  laboratory_category?: string;
}
