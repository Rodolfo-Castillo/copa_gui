<template>
    <q-dialog persistent v-model="open">
        <q-card style="width: 500px">
            <q-bar class="bg-primary text-white">
                <span class="text-white">Información del Partido</span>
                <q-space></q-space>
                <q-btn dense flat icon="close" v-close-popup>
                    <q-tooltip>Cerrar</q-tooltip>
                </q-btn>
            </q-bar>
            <q-card-section>
                <div class="row">
                    <div class="col-5" align="right">
                        <span class="text-h3 text-weight-bold">{{
                            finalesStore.partidoInfo.local
                        }}</span>
                        <div class="col-12 rectangulo" align="right">
                            <span class="text-h4 text-weight-bold">
                                {{ finalesStore.partidoInfo.goleslocal }}
                            </span>
                        </div>
                        <div
                            v-if="finalesStore.partidoInfo.penales == 1"
                            class="col-12"
                            align="right"
                        >
                            <span class="text-h5 text-weight-bold">
                                ({{ finalesStore.partidoInfo.penaleslocal }})
                            </span>
                        </div>
                    </div>
                    <div class="col-2"></div>
                    <div class="col-5" align="left">
                        <span class="text-h3 text-weight-bold">{{
                            finalesStore.partidoInfo.visitante
                        }}</span>
                        <div class="col-12 rectangulo" align="left">
                            <span class="text-h4 text-weight-bold">
                                {{ finalesStore.partidoInfo.golesvisitante }}
                            </span>
                        </div>
                        <div
                            v-if="finalesStore.partidoInfo.penales == 1"
                            class="col-12"
                            align="left"
                        >
                            <span class="text-h5 text-weight-bold">
                                ({{
                                    finalesStore.partidoInfo.penalesvisitante
                                }})
                            </span>
                        </div>
                    </div>
                </div>
            </q-card-section>
            <q-card-section v-if="info.jugado">
                <div class="row">
                    <div class="col-5">
                        <div
                            v-for="(gol, i) in finalesStore.partidoInfo
                                .golesLocal"
                            :key="i"
                            class="col-12"
                            align="right"
                        >
                            <span class="text-h6">
                                {{ gol.nombre }}
                                {{ gol.goles }}
                                <q-icon name="sports_soccer"></q-icon>
                            </span>
                        </div>
                        <div
                            v-for="(expulsion, i) in finalesStore.partidoInfo
                                .expulsionesLocal"
                            :key="i"
                            class="col-12"
                            align="right"
                        >
                            <span class="text-h6">
                                {{ expulsion.nombre }}
                                <q-icon
                                    name="crop_portrait"
                                    color="red"
                                ></q-icon>
                            </span>
                        </div>
                    </div>
                    <div class="col-2"></div>
                    <div class="col-5">
                        <div
                            v-for="(gol, i) in finalesStore.partidoInfo
                                .golesVisitante"
                            :key="i"
                            class="col-12"
                            align="left"
                        >
                            <span class="text-h6">
                                <q-icon name="sports_soccer"></q-icon>
                                {{ gol.nombre }}
                                {{ gol.goles }}
                            </span>
                        </div>
                        <div
                            v-for="(expulsion, i) in finalesStore.partidoInfo
                                .expulsionesVisitante"
                            :key="i"
                            class="col-12"
                            align="left"
                        >
                            <span class="text-h6">
                                <q-icon
                                    name="crop_portrait"
                                    color="red"
                                ></q-icon>
                                {{ expulsion.nombre }}
                            </span>
                        </div>
                    </div>
                </div>
            </q-card-section>
            <q-card-section v-else>
                <div class="row">
                    <div class="col-3" align="right"></div>
                    <div class="col-6">
                        <div>
                            <span class="text-h6">
                                Cancha: {{ finalesStore.partidoInfo.cancha }}
                            </span>
                        </div>
                        <div>
                            <span class="text-h6">
                                Fecha: {{ finalesStore.partidoInfo.fecha }} a
                                las {{ finalesStore.partidoInfo.hora }} hrs.
                            </span>
                        </div>
                    </div>
                    <div class="col-3" align="left"></div>
                </div>
            </q-card-section>
            <q-separator v-if="!info.jugado" />
            <q-card-actions v-if="!info.jugado" align="right">
                <q-btn
                    label="Resultado"
                    color="primary"
                    @click="router.push(`/resultadoliguilla/${info.idpartido}`)"
                ></q-btn>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
<script lang="ts" setup>
import { watch } from "vue";
import { useFinalesStore } from "@/store/finales";
import { useRouter } from "vue-router";

const finalesStore = useFinalesStore();
const router = useRouter();
const open = <any>defineModel("open");
const info = <any>defineModel("info");

watch(info, async (newInfo, _oldInfo) => {
    try {
        await finalesStore.getInfoPartido(newInfo.idpartido);
    } catch (e: any) {
        console.error(e);
    }
});
</script>
<style>
.rectangulo {
    width: 50px; /* Ancho del rectángulo */
    height: 50px; /* Alto del rectángulo */
    display: flex; /* Usamos flexbox para centrar el contenido */
    justify-content: center; /* Centrar horizontalmente */
    align-items: center; /* Centrar verticalmente */
    font-size: 48px; /* Tamaño de la fuente para el 0 */
    color: black; /* Color del texto */
    font-weight: bold; /* Hacer el texto negrita */
    border: 1px solid;
}
</style>
