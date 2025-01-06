import { defineStore } from "pinia";
import { HttpGet, HttpPost, HttpPut, HttpDelete } from "@/utils/http";
import { CopaInterface } from "@/utils/interfaces";
import { transformarBitToBoolean } from "@/utils/utils";

const ruta = "catalogos/";

export const useCatalogoStore = defineStore("catalogo", {
    state: () => ({
        categorias: [],
        sexos: [],
        copas: [],
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
        },
        async listCopas() {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`${ruta}copas/`, {});
                res.data.copas.map((copa: CopaInterface) => {
                    copa.activo = transformarBitToBoolean(copa.activo);
                })
                this.$state.copas = res.data.copas;
            } catch (e:any) {
                this.$state.msg = e.message;
                this.$state.error = true;
            }
            finally {
                this.$state.isLoading = false;
            }
        },
        async addCopa(formData:{}) {
            try {
                this.$state.isLoading = true;
                const res = await HttpPost(`${ruta}copa`, formData);
                res.data.activo = transformarBitToBoolean(res.data.activo);
                this.$state.copas = [
                    ...this.$state.copas,
                    res.data
                ];
            } catch (e:any) {
                this.$state.msg = e.message;
                this.$state.error = true;
            }
            finally {
                this.$state.isLoading = false;
            }
        },
        async updCopa(idCopa:number,formData:{}) {
            try {
                this.$state.isLoading = true;
                const res = await HttpPut(`${ruta}copa/${idCopa}`, formData);
                const copasCopy = this.$state.copas;
                copasCopy.map((copa: CopaInterface) => {
                    copa.activo = false;
                    if (copa.idcopa === idCopa) {
                        copa.copa = res.data.copa;
                        copa.activo = true;
                    }
                });
                this.$state.copas = copasCopy;
            } catch (e:any) {
                this.$state.msg = e.message;
                this.$state.error = true;
            }
            finally {
                this.$state.isLoading = false;
            }
        },
        async delCopa(idCopa:number) {
            try {
                this.$state.isLoading = true;
                await HttpDelete(`${ruta}copa/${idCopa}`, {});
                const copasCopy = this.$state.copas;
                this.$state.copas = copasCopy.filter((copa: CopaInterface) => copa.idcopa != idCopa);
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