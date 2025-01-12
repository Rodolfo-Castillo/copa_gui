import { defineStore } from "pinia";
import { HttpGet, HttpPost } from "@/utils/http";
import { PermisoInterface } from "@/utils/interfaces";
import { transformarBitToBoolean } from "@/utils/utils";

const ruta = "config/";

export const useConfiguracionStore = defineStore("configuracion", {
    state: () => ({
        personas: <any>[],
        permisos: <any>[],
        isLoading: false,
        msg: "",
        error: false,
    }),
    actions: {
        async getPersonas() {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`${ruta}personas`, {});
                this.$state.personas = res.data.personas;
            } catch (err) {
                console.log(err)
            }
            finally {
                this.$state.isLoading = false;
            }
        },
        async getPermisos(idusuario: number) {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`${ruta}permisos/${idusuario}`, {});
                res.data.permisos.map((permiso: PermisoInterface) => {
                    permiso.tiene = transformarBitToBoolean(permiso.tiene);
                });
                this.$state.permisos = res.data.permisos;
            } catch (err) {
                console.log(err)
            }
            finally {
                this.$state.isLoading = false;
            }
        },
        async addPermisos(formData : {}) {
            try {
                this.$state.isLoading = true;
                this.$state.permisos = [];
                const res = await HttpPost(`${ruta}permisos`, formData);
                this.$state.permisos = res.data.permisos;
            } catch (err) {
                console.log(err)
            }
            finally {
                this.$state.isLoading = false;
            }
        }
    }
});