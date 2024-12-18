<template>
    <div>
        <q-card>
            <q-card-section class="bg-primary text-white q-pa-sm">
                <div class="text-h6">Equipos</div>
            </q-card-section>
            <q-card-section>
                <q-breadcrumbs v-if="!store.isLoading">
                    <q-breadcrumbs-el label="Equipos" icon="home" />
                </q-breadcrumbs>
            </q-card-section>
            <q-card-section>
                <q-card-section align="right">
                    <q-btn
                        color="primary"
                        round
                        icon="add"
                        @click="router.push('/equipo')"
                        :disable="store.isLoading"
                    >
                        <q-tooltip> Agregar Equipo </q-tooltip>
                    </q-btn>
                </q-card-section>
                <div class="row">
                    <div
                        class="col-3 col-md-2 q-pl-md q-mt-md q-py-xs"
                        v-for="(equipo, i) in store.equipos"
                        :key="i"
                    >
                        <TarjetaEquipo
                            :idequipo="equipo.idequipo"
                            :equipo="equipo.equipo"
                            :categoria="equipo.categoria"
                            :jugadores="equipo.jugadores"
                        />
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useEquipoStore } from "@/store/equipo";
import TarjetaEquipo from "@/components/TarjetaEquipo.vue";

const router = useRouter();
const store = useEquipoStore();

onMounted(async () => {
    await store.listEquipos();
});
</script>
