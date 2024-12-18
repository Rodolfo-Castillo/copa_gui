import { defineStore } from "pinia";
import { HttpGet } from "@/utils/http";

const ruta = "bitacora/";

export const useBitacoraStore = defineStore("bitacora", {
    state: () => ({
        bitacora: <any>[],
        isLoading: false,
        msg: "",
        error: false,
    }),
    actions: {
        async listBitacora() {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`${ruta}`, {});
                this.$state.bitacora = res.data.bitacora;
            } catch (e: any) {
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
                this.$state.isLoading = false;
            }
        }
    }
});