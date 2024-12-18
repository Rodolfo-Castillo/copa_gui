// Utilities
import { defineStore } from "pinia";
import { HttpGet, HttpPost, HttpPut } from "@/utils/http";
import { generateRounds, transformarHorario } from "@/utils/utils";

const ruta = 'partidos/';

export const usePartidosStore = defineStore("partidos", {
    state: () => ({
        partidos:<any>[],
        isLoading: false,
        msg: "",
        error: false,
    }),
    actions: {
        async getEquipos(idCategoria:number) {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`${ruta}equipos/${idCategoria}`, {});
                const grupos = res.data.equipos.map((equipo: any) => equipo.grupo);
                const gruposUnicos = new Set(grupos);
                const partidos = {};
                let i = 1;
                for (const [_key, value] of gruposUnicos.entries()) {
                    const equiposPorGrupo = res.data.equipos.filter((equipo: any) => equipo.grupo == value)
                    const matches = await generateRounds(equiposPorGrupo);
                    partidos["Grupo " + Number(value)] = [];
                    matches.map((partido: any) => {
                        partido.map((match: any) => {
                            partidos["Grupo " + Number(value)].push({
                                "Local": match[0],
                                "Visitante": match[1],
                            })
                        });
                        i++;
                    })
                    i = 1;
                }
                for (const [_key, value] of gruposUnicos.entries()) { 
                    this.savePartidos(partidos["Grupo " + Number(value)],idCategoria)
                }
            } catch (e: any) {
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
                this.$state.isLoading = false;
            }
        },
        async savePartidos(grupo: [],idCategoria:number) {
            try {
                this.$state.isLoading = true;
                grupo.map(async (jornada: any) => {
                    const params = {
                        idequipolocal: jornada.Local.idequipo,
                        idequipovisitante: jornada.Visitante.idequipo,
                        idcategoria:idCategoria
                    }
                    const res = await HttpPost(`${ruta}`, params);
                    this.$state.partidos = [
                        ...this.$state.partidos,
                        res.data
                    ];
                })
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
                const res = await HttpGet(`${ruta}`, {});
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
        async setHorarioPartido(idpartido:number, formData: {}) {
            try {
                this.$state.isLoading = true;
                const res = await HttpPut(`${ruta}${idpartido}`, formData);
                const newArray = this.$state.partidos;
                newArray.map((element: any) => {
                    if (element.idpartido == res.data.idpartido) {
                        element.hora = transformarHorario(res.data.hora);
                        element.cancha = res.data.cancha;
                        element.fecha = res.data.fecha;
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
