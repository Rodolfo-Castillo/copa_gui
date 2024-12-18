export interface NotifyInterface {
    msg: string;
    color: string;
    icon: string;
}

export interface JugadorInterface{
    idjugador: number;
    nombres: string;
    paterno: string;
    materno: string;
    fechanacimiento: string;
    idsexo: number;
    idequipo: string;
    foto: string;
}

export interface EquipoInterface{
    idequipo: number;
    equipo: string;
    entrenador: string;
    idcategoria: number;
}