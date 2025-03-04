// Utilities
import { defineStore } from "pinia";
import { HttpGet } from "@/utils/http";

const ruta = 'estadistica/';

export const useEstadisticaStore = defineStore("estadistica", {
    state: () => ({
        grupos: <any>[],
        goleadores: <any>[],
        porteros: <any>[],
        expulsiones: <any>[],
        isLoading: false,
        msg: "",
        error: false,
    }),
    actions: {
        async getEstadisticaGrupos(idcategoria:number) {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`${ruta}grupos/${idcategoria}`, {});
                console.log(res.data.estadistica);
                this.$state.grupos = [res.data.estadistica.filter((equipo: any) => equipo.grupo == 1),
                    res.data.estadistica.filter((equipo: any) => equipo.grupo == 2),
                    res.data.estadistica.filter((equipo: any) => equipo.grupo == 3),
                    res.data.estadistica.filter((equipo:any) => equipo.grupo == 4)];
            } catch (e) {
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
                this.$state.isLoading = false;
            }
        },
        async getEstadisticaGoleador(idcategoria:number) {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`${ruta}goleador/${idcategoria}`, {});
                if(res.data.goleadores !== null)
                    this.$state.goleadores = res.data.goleadores;
            } catch (e) { 
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
                this.$state.isLoading = false;
            }
        },
        async getEstadisticaPortero(idcategoria:number) {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`${ruta}portero/${idcategoria}`, {});
                if(res.data.porteros !== null)
                this.$state.porteros = res.data.porteros;
            } catch (e) {
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
                this.$state.isLoading = false;
            }
        },
        async getEstadisticaExpulsion(idcategoria:number) {
            try {
                this.$state.isLoading = true;
                const res = await HttpGet(`${ruta}expulsion/${idcategoria}`, {});
                if(res.data.expulsiones !== null)
                this.$state.expulsiones = res.data.expulsiones;
            } catch (e) {
                this.$state.msg = e.message;
                this.$state.error = true;
            } finally {
                this.$state.isLoading = false;
            }
        },
        setGrupos (data:Array<any> = []){
            this.$state.grupos = data;
        },
        setError() {
            this.$state.error = false;
        }
    }
});