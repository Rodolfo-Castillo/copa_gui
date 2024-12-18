import { defineStore } from "pinia";
import { HttpPost, HttpPostMedia, HttpGet, HttpDelete } from "@/utils/http";

const ruta = "equipo/";

export const useEquipoStore = defineStore("equipo", {
    state: () => ({
        equipos: [],
        equipo: <any>{},
        isLoading: false,
        msg: "",
        error: false,
    }),
    actions: {
        async addEquipo(equipo:{}, jugadores:[]) {
            try {
                this.$state.isLoading = true;
                const res = await HttpPost(`${ruta}`, equipo);
                if (res.data.idequipo && jugadores.length > 0) {
                    jugadores.map(async (jugador:any) => {
                        const formData = new FormData();
                        formData.append('nombres',jugador.nombres);
                        formData.append('paterno',jugador.paterno);
                        formData.append('materno',jugador.materno);
                        formData.append('fechanacimiento',jugador.fechanacimiento);
                        formData.append('idsexo',jugador.idsexo);
                        formData.append('foto',jugador.foto);
                        formData.append('idequipo', res.data.idequipo);
                        formData.append('esportero',jugador.esportero);
                        await HttpPostMedia(`${ruta}jugadores`, formData);
                    })
                }
            } catch (e:any) { 
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
               this.$state.isLoading = false;
            }
        },
        async listEquipos() {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`${ruta}`, {});
                this.$state.equipos = res.data.equipos
            } catch (e:any) { 
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
               this.$state.isLoading = false;
            }
        },
        async getEquipo(idequipo:number) {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`${ruta}${idequipo}`, {});
                this.$state.equipo = res.data;
            } catch (e:any) { 
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
               this.$state.isLoading = false;
            }
        },
        async getImagenJugador(imageName: string) {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`imagen/${imageName}`, {});
                return res.data;
            } catch (e:any) { 
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
               this.$state.isLoading = false;
            }
        },
        async updJugadorEquipo(jugadores: []) {
            try {
                this.$state.isLoading = true;
                jugadores.map(async (jugador: any) => {
                    if (!jugador.idjugador) {
                        const formData = new FormData();
                        formData.append('nombres',jugador.nombres);
                        formData.append('paterno',jugador.paterno);
                        formData.append('materno',jugador.materno);
                        formData.append('fechanacimiento',jugador.fechanacimiento);
                        formData.append('idsexo',jugador.idsexo);
                        formData.append('foto',jugador.foto);
                        formData.append('idequipo', jugador.idequipo);
                        formData.append('esportero',jugador.esportero);
                        await HttpPostMedia(`${ruta}jugadores`,formData);   
                    }
                })
            }
            catch (e:any) { 
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
               this.$state.isLoading = false;
            }
        },
        async deleteJugador(idjugador: number) {
            try {
                this.$state.isLoading = true;
                const res = await HttpDelete(`${ruta}jugador/${idjugador}`, {});
                const jugadores = this.$state.equipo.jugadores.filter((jugador: any) => jugador.idjugador != res.data.idjugador);
                this.$state.equipo.jugadores = jugadores;
            } catch (e: any) {
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
                this.$state.isLoading = false;
            }
        },
        async deleteEquipo(idequipo: number) {
            try {
                this.$state.isLoading = true;
                const res = await HttpDelete(`${ruta}${idequipo}`, {});
                const equipos = this.$state.equipos.filter((equipo: any) => equipo.idequipo != res.data.idequipo);
                this.$state.equipos = equipos;
            } catch (e: any) {
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
                this.$state.isLoading = false;
            }
        }
    }
});