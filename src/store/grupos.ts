// Utilities
import { defineStore } from "pinia";
import { HttpGet, HttpPost } from "@/utils/http";

const ruta = 'grupos/';

export const useGruposStore = defineStore("grupos", {
    state: () => ({
        equipos:<any>[],
        isLoading: false,
        msg: "",
        error: false,
    }),
    actions: {
        async getEquiposCategoria(idcategoria: number) {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`${ruta}equipos/${idcategoria}`, {});
                this.$state.equipos = res.data.equipos;
            } catch (e:any) { 
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
                this.$state.isLoading = false;
            }
        },
        async saveEquiposGrupos(grupos:[]) {
            try {
                this.$state.isLoading = true;
                const res = await HttpPost(`${ruta}equipos`, { "grupos": grupos });
                this.$state.equipos = res.data.equipos;
            } catch (e) { 
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
                this.$state.isLoading = false;
            }
        },
        setError() {
            this.$state.error = false;
        },
    },
});
