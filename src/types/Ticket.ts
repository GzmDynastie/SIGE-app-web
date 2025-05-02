export enum Priority {
    Baja = "baja",
    Media = "media",
    Alta = "alta"
}

export enum Status {
    Abierto = "abierto",
    Cerrado = "cerrado"
}

export enum Category {
    Incidente = "Incidente",
    SolicitudServicio = "Solicitud de servicio",
    ReporteAula = "Reporte de aula",
    ReinstalacionSO = "Reinstalacion de S.O.",
    InstalacionPaq = "Instalacion de paqueteria",
    AsignacionIP = "Asignacion de IP"
}

export interface Ticket {
    id_ticket: number;
    category: Category;
    status: Status;
    communication: string;
    report: string;
    priority: Priority;
    folio?: string;
    applicant: string;
    start_date?: Date;
    end_date?: Date;
    creation_date?: string;
    solution?: string;
    id_technical: number;
    id_area: number;
    sede?: string;
    division?: string;
    building?: string;
    floor_?: number;
    classroom?: string;
    name_technical?: string;
    last_name_technical?: string;
}