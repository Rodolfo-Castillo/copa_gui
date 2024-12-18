// Utilities
import { defineStore } from "pinia";
import { HttpGet, HttpPut } from "@/utils/http";
import { transformarBitToBoolean } from "@/utils/utils";

const ruta = 'expulsiones/';

export const useExpulsionesStore = defineStore("expulsiones", {
    state: () => ({
        expulsados: <any>[],
        isLoading: false,
        msg: "",
        error: false,
    }),
    actions: {
        async listExpulsados() {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`${ruta}`, {});
                res.data.expulsiones.map((expulsion: any) => {
                    expulsion.suspendido = transformarBitToBoolean(expulsion.suspendido);
                })
                this.$state.expulsados = res.data.expulsiones;
            } catch (e: any) {
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
                this.$state.isLoading = false;
            }
        },
        async updSuspendidos(idjugador: number) {
            try {
                this.$state.isLoading = true;
                const res = await HttpPut(`${ruta}${idjugador}`, {});
                const newArray = this.$state.expulsados.filter((expulsado: any) => 
                    expulsado.idjugador != res.data.idjugador
                );
                this.$state.expulsados = newArray;
            } catch (e: any) {
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
                this.$state.isLoading = false;
            }
        }
    }
});