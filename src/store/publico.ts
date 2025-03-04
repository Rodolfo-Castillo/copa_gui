// Utilities
import { defineStore } from "pinia";
import { HttpGet } from "@/utils/http";
// import { transformarHorario } from "@/utils/utils";

const ruta = "publico/";

export const usePublicoStore = defineStore("publico", {
    state: () => ({
        categorias: <any>[],
        copas: <any>[],
        equipos: <any>[],
        isLoading: false,
        msg: "",
        error: false,
        isValid: <boolean>false
    }),
    actions: {
        async listPublicoCopas() {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`${ruta}copas`, {});
                this.$state.copas = res.data.copas;
            } catch (e:any) {
                this.$state.msg = e.message;
                this.$state.error = true;
            }
            finally {
                this.$state.isLoading = false;
            }
        },
        async listPublicoCategorias(idCopa:number) {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`${ruta}categorias/${idCopa}`, {});
                this.$state.categorias = res.data.categorias;
            } catch (e:any) {
                this.$state.msg = e.message;
                this.$state.error = true;
            }
            finally {
                this.$state.isLoading = false;
            }
        },
        async listPublicoEquipos(idCopa:number, idCategoria:number) {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`${ruta}equipos/${idCopa}/${idCategoria}`, {});
                this.$state.equipos = res.data.equipos;
            } catch (e:any) {
                this.$state.msg = e.message;
                this.$state.error = true;
            }
            finally {
                this.$state.isLoading = false;
            }
        },
    }
});