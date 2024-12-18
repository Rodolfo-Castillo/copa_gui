// Utilities
import { defineStore } from "pinia";
import { HttpGet, HttpPost, HttpPut } from "@/utils/http";
import { transformarHorario } from "@/utils/utils";

const ruta = 'partidosfinales/';

export const usePartidosFinalesStore = defineStore("partidosfinales", {
    state: () => ({
        partidos:<any>[],
        isLoading: false,
        msg: "",
        error: false,
        isValid: <boolean>false
    }),
    actions: {
        async verificar(idCategoria:number) {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`${ruta}verificar/${idCategoria}`, {});
                this.$state.isValid = res.data.valido;
            } catch (e: any) {
                this.$state.msg = e.message;
                this.$state.error = true;
                this.$state.isValid = false;
            } finally {
                this.$state.isLoading = false;
            }
        },
        async getEquipos(idCategoria:number) {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`${ruta}equipos/${idCategoria}`, {});
                const data = res.data.equipos;
                await this.savePartidos({
                    idequipolocal: data[0].idequipo,
                    idequipovisitante: data[3].idequipo,
                    idcategoria: idCategoria,
                    orden: 1
                });
                await this.savePartidos({
                    idequipolocal: data[4].idequipo,
                    idequipovisitante: data[7].idequipo,
                    idcategoria: idCategoria,
                    orden: 2
                });
                await this.savePartidos({
                    idequipolocal: data[2].idequipo,
                    idequipovisitante: data[1].idequipo,
                    idcategoria: idCategoria,
                    orden: 3
                });
                await this.savePartidos({
                    idequipolocal: data[6].idequipo,
                    idequipovisitante: data[5].idequipo,
                    idcategoria: idCategoria,
                    orden: 4
                });
            } catch (e: any) {
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
                this.$state.isLoading = false;
            }
        },
        async savePartidos(formData:any) {
            try {
                this.$state.isLoading = true;
                const res = await HttpPost(`${ruta}partido`, formData);
                this.$state.partidos = [
                    ...this.$state.partidos,
                    res.data
                ];
                this.$state.isValid = false;
            } catch (e: any) {
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
                this.$state.isLoading = false;
            }
        },
        async listPartidos() {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`${ruta}partido`, {});
                if (res.data.partidos == null)
                    this.$state.partidos = [];
                else
                    this.$state.partidos = res.data.partidos;
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
        async setHorarioPartido(idpartidoliguilla:number, formData: {}) {
            try {
                this.$state.isLoading = true;
                const res = await HttpPut(`${ruta}partido/${idpartidoliguilla}`, formData);
                const newArray = this.$state.partidos;
                newArray.map((element: any) => {
                    if (element.idpartido == res.data.idpartido) {
                        element.fecha = res.data.fecha;
                        element.hora = transformarHorario(res.data.hora);
                        element.cancha = res.data.cancha;
                    }
                });
                this.$state.partidos = newArray;
            } catch (e: any) {
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
                this.$state.isLoading = false;
            }
        }
    },
});
