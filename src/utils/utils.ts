import { Notify } from 'quasar';
import { NotifyInterface } from './interfaces';
import { HttpGet } from './http';
import robin from 'roundrobin';

export const showNotify = (config:NotifyInterface) => {
    Notify.create({
        message: config.msg,
        position:'top-right',
        color: config.color,
        icon:config.icon,
        progress: true,
        actions: [{ icon: 'close', color: 'white' }]
    });
}

export const validarToken = async () => {
    const res = await HttpGet(`/verify/`, {});
    return res.data;
}

export const validateRoute = async () => {
    const token = localStorage.getItem("token");
    if (token) {
        const data = atob(token.split(".")[1]);
        const exp = JSON.parse(data).exp;
        if (exp < Date.now() / 1000) {
            localStorage.clear();
            return false;
        } else {
            return true;
        }
    }
};

export const toBase64 = async (file:File) => {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64String = reader.result as string;
            let base64 = base64String.split(',')[1]
            base64 = base64.replace(/\s+/g, '');
            resolve(base64);
        }

        reader.onerror = (error) => reject(error);
        
    });
};

export const urlToFile = async (url:any, filename:any) => {
    const response = await fetch(url);
    const blob = await response.blob(); // Obtén el contenido como un Blob
    const file = new File([blob], filename, { type: blob.type }); // Crea un objeto File
    return file;
}

export const Base64ToFile = (dataurl:string, filename:string) => {
    var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};

const getFormatDate = () => {
        // Crear un nuevo objeto Date que representa la fecha actual
    const today = new Date();

    // Obtener el año, mes y día
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');  // Los meses en JavaScript empiezan desde 0
    const day = String(today.getDate()).padStart(2, '0');  // Asegura que el día tenga dos dígitos

    // Formatear la fecha en el formato deseado
    const formattedDate = `${year}/${month}/${day}`;

    return formattedDate
}

export const transformarBitToBoolean = (value: number) => {
    return value === 1 ? true : false;
}

export const DateRange = (date: string) => {
    return date <= getFormatDate();
}

export const generateRounds = async (teams: any) => {
    return robin(teams.length, teams);
}

export const transformarHorario = (hora:string) => {
    // Usamos split para separar la cadena por el carácter ':'
    const partes = hora.split(':');

    // Retornamos solo las primeras dos partes: horas y minutos
    return `${partes[0]}:${partes[1]}`;
}

export const formatoFechaEnLetra = (fecha:string) => {
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    // Crear un objeto Date a partir de la fecha en formato "YYYY-MM-DD"
    const fechaObj = new Date(fecha);

    // Obtener el día de la semana, el día del mes, el mes y el año
    const diaSemana = dias[fechaObj.getDay()]; // Día de la semana (0-6)
    const diaDelMes = fechaObj.getDate(); // Día del mes
    const mes = meses[fechaObj.getMonth()]; // Mes (0-11)
    const anio = fechaObj.getFullYear(); // Año

    // Devolver la fecha en formato: "Día de la semana Día del mes de Mes del Año"
    return `${diaSemana} ${diaDelMes} de ${mes} del ${anio}`;
}

export const getFinalsMatches = async (partidos: any, equipos: any) => {
    const data = <any>{
        rounds: [
            {
                name: "Cuartos de Final",
            },
            {
                name: "Semifinal",
            },
            {
                name: "Final",
            },
        ]
    };
    const matches = <any>[];
    const contestants = <any>{};
    partidos.map((partido: any) => {
        matches.push({
            idpartido: partido.idpartidoliguilla,
            jugado: partido.jugado == 1 ? true : false,
            roundIndex: partido.roundindex,
            order: partido.orden-1,
            sides: [
                {
                    contestantId: partido.idlocal.toString(),
                    scores: [{
                        mainScore: partido.goleslocal,
                    }],
                    isWinner: partido.jugado && partido.ganador == partido.idlocal ? true : false
                },
                {
                    contestantId: partido.idvisitante.toString(),
                    scores: [{
                        mainScore: partido.golesvisitante,
                    }],
                    isWinner: partido.jugado && partido.ganador == partido.idvisitante ? true : false
                },
            ]
        }); 
    });
    equipos.map((equipo: any) => {
        contestants[equipo.idequipo] = {
            entryStatus: equipo.posicion.toString(),
            players: [{
                title: equipo.equipo
            }]
        }
    });
    data.matches = matches;
    data.contestants = contestants;
    return data;
}