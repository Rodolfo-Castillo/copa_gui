import { defineStore } from "pinia";
import { HttpPost, HttpGet, HttpPut } from "@/utils/http";
import { transformarHorario, formatoFechaEnLetra, transformarBitToBoolean } from "@/utils/utils";

const ruta = "finales/";

export const useFinalesStore = defineStore("finales", {
    state: () => ({
        partidos: <any>[],
        equipos: <any>[],
        partidoInfo: <any>{},
        partidResultado: <any>{},
        jugadoresLocal: <any>[],
        jugadoresVisitante: <any>[],
        siguientesCruces: <any>[],
        isLoading: false,
        msg: "",
        error: false,
    }),
    actions: {
        async getPartidos(idcategoria:number) {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`${ruta}${idcategoria}`, {});
                if (res.data.equipos != null && res.data.partidos != null) {
                    this.$state.equipos = res.data.equipos;   
                    this.$state.partidos = res.data.partidos;   
                }
                else {
                    this.$state.equipos = [];   
                    this.$state.partidos = [];   
                }
            } catch (e: any) {
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
                this.$state.isLoading = false;
            }
        },
        async getInfoPartido(idPartido: number) {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`${ruta}info/${idPartido}`, {});
                res.data.hora = transformarHorario(res.data.hora);
                res.data.fecha = formatoFechaEnLetra(res.data.fecha);
                // res.data.penales = transformarBitToBoolean(res.data.penales);
                this.$state.partidoInfo = res.data;
            } catch (e: any) {
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
                this.$state.isLoading = false;
            }
        },
        async getResultadoPartido(idPartido: number) {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`${ruta}resultado/${idPartido}`, {});
                res.data.penales = transformarBitToBoolean(res.data.penales);
                this.$state.partidResultado = res.data;
                this.getJugadoresLocal(res.data.idlocal);
                this.getJugadoresVisitante(res.data.idvisitante);
            } catch (e: any) {
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
                this.$state.isLoading = false;
            }
        },
        async getJugadoresLocal(idequipo: number) {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`resultados/jugadores/${idequipo}`, {});
                res.data.jugadores.map((jugador: any) => {
                    jugador.foto = `${import.meta.env.VITE_HOST_API}imagen/${jugador.foto}/`
                    jugador.goles = 0;
                    jugador.expulsado = false;
                });
                this.$state.jugadoresLocal = res.data.jugadores;
            } catch (e: any) {
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
                this.$state.isLoading = false;
            }
        },
        async getJugadoresVisitante(idequipo: number) {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`resultados/jugadores/${idequipo}`, {});
                res.data.jugadores.map((jugador: any) => {
                    jugador.foto = `${import.meta.env.VITE_HOST_API}imagen/${jugador.foto}/`
                    jugador.goles = 0;
                    jugador.expulsado = false;
                });
                this.$state.jugadoresVisitante = res.data.jugadores;
            } catch (e: any) {
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
                this.$state.isLoading = false;
            }
        },
        async addResultadoFinal(formData:{}) {
            try {
                this.$state.isLoading = true;
                await HttpPost(`${ruta}resultado`, formData);
            } catch (e: any) {
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
                this.$state.isLoading = false;
            }
        },
        async setGolesJugador(idjugador:number,goles:number,idpartido:number) {
            try {
                this.$state.isLoading = true;
                await HttpPut(`${ruta}resultados/jugador/goles/${idjugador}`, {goles,idpartido});
            } catch (e: any) {
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
                this.$state.isLoading = false;
            }
        },
        async setExpulsionJugador(idjugador:number, idpartido:number) {
            try {
                this.$state.isLoading = true;
                await HttpPut(`${ruta}resultados/jugador/expulsion/${idjugador}`, {idpartido});
            } catch (e: any) {
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
                this.$state.isLoading = false;
            }
        },
        async addSiguientesCruces(idcategoria: number) {
            try {
                this.$state.isLoading = true;
                const res = await HttpPost(`${ruta}siguienteCruce`, { idcategoria });
                this.$state.siguientesCruces = res.data.partidos;
            }
            catch (e) {
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally { 
                this.$state.isLoading = false;
            }
        },
        setError() {
            this.$state.error = false;
        },
    }
});