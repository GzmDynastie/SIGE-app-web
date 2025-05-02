export enum Sede {
    Centro = "Centro",
}

export enum Boolean {
    True = "true",
    False = "false",
}

export enum TypeSpace {
    Administrativo = "Administrativo",
    Auditorio = "Auditorio",
    Aula = "Aula",
    CabinaRadio = "Cabina de Radio",
    Dibujo = "Dibujo",
    Laboratorio = "Laboratorio",
}

export enum Building {
    Edificio1 = "Edificio 1",
    Edificio2 = "Edificio 2",
    Edificio3 = "Edificio 3",
    Edificio4 = "Edificio 4",
    Edificio5 = "Edificio 5",
}

export enum Floor {
    PB = "Planta Baja",
    P1 = "Piso 1",
    P2 = "Piso 2",
    P3 = "Piso 3",
    P4 = "Piso 4",
    P5 = "Piso 5",
    P6 = "Piso 6",
}

export enum Division {
    D1 = "Bachillerato",
    D2 = "Control Escolar",
    D3 = "Cabina de Radio",
    D4 = "Dibujo",
    D5 = "Ing. en Computación",
    D6 = "Ing. en Comunicaciones y Electrónica",
    D7 = "Ing. Industrial",
    D8 = "Ing. Mecánica",
    D9 = "Lic. en Derecho",
    D10 = "Lic. en Diseño Gráfico",
    D11 = "Lic. en Administración de Empresas",
    D12 = "Lic. en Nutrición",
    D13 = "Lic. en Mercadotecnia",
    D14 = "Lic. en Negocios Internacionales",
    D15 = "Lic. en Trabajo Social",
    D16 = "Lic. Psicologia",
    D17 = "Lic. en Ciencias de la Comunicación",
    D18 = "Lic. en Arquitectura",
}

export function getArea(area: Area) {
    return `${area.sede} - ${area.division} - ${area.building} - ${area.floor} - ${area.classroom}`
}

export interface Area {
    id_area: number,
    type_space: TypeSpace,
    sede: Sede,
    building: Building,
    floor: Floor,
    division: Division,
    coordination: string,
    classroom_lab: boolean,
    image: (string | File)[],
    equipment: string[],
    status?: boolean,
    classroom: string,
}