import { defineStore } from "pinia";
import { HttpGet } from "@/utils/http";

const ruta = "catalogos/";

export const useCatalogoStore = defineStore("catalogo", {
    state: () => ({
        categorias: [],
        sexos: [],
        isLoading: false,
        msg: "",
        error: false,
    }),
    actions: {
        async listCategorias() {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`${ruta}categorias/`, {});
                this.$state.categorias = res.data.categorias;
            } catch (e:any) {
                this.$state.msg = e.message;
                this.$state.error = true;
            }
            finally {
                this.$state.isLoading = false;
            }
        },
        async listSexos() {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`${ruta}sexos/`, {});
                this.$state.sexos = res.data.sexos;
            } catch (e:any) {
                this.$state.msg = e.message;
                this.$state.error = true;
            }
            finally {
                this.$state.isLoading = false;
            }
        }
    }
});