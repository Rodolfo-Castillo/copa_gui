// Utilities
import { defineStore } from "pinia";
import { HttpGet, HttpPost, HttpPut } from "@/utils/http";
import { transformarHorario } from "@/utils/utils";

const ruta = 'resultados/';

export const useResultadosStore = defineStore("resultados", {
    state: () => ({
        resultados: <any>[],
        partido: <any>{},
        jugadoresLocal: <any>[],
        jugadoresVisitante: <any>[],
        infoPartido:<any>{},
        isLoading: false,
        msg: "",
        error: false,
    }),
    actions: {
        async listResultados() {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`${ruta}`, {});
                res.data.partidos.map((element: any) => {
                    element.hora = transformarHorario(element.hora);
                });
                this.$state.resultados = res.data.partidos;
            } catch (e: any) {
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
                this.$state.isLoading = false;
            }
        },
        async getPartidoInfo(idpartido: number) {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`${ruta}${idpartido}`, {});
                this.$state.partido = res.data;
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
                const res = await HttpGet(`${ruta}jugadores/${idequipo}`, {});
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
                const res = await HttpGet(`${ruta}jugadores/${idequipo}`, {});
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
                await HttpPost(`${ruta}`, formData);
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
                await HttpPut(`${ruta}jugador/goles/${idjugador}`, {goles,idpartido});
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
                await HttpPut(`${ruta}jugador/expulsion/${idjugador}`, {idpartido});
            } catch (e: any) {
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
                this.$state.isLoading = false;
            }
        },
        async getResultadoFinalInfo(idpartido:number) {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`${ruta}partido/${idpartido}`, {});
                this.$state.infoPartido = res.data;
            } catch (e: any) {
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