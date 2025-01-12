<template>
    <q-card class="bg-cyan-2" style="border: 2px solid #0097a7" flat bordered>
        <q-card-section horizontal>
            <q-card-section>
                <div class="text-h6">{{ equipo }}</div>
                <div class="text-subtitle2">Categoría: {{ categoria }}</div>
                <div class="text-subtitle2">Entrenador: {{ entrenador }}</div>
                <div class="text-subtitle2">
                    Jugadores Inscritos: {{ jugadores }}
                </div>
            </q-card-section>

            <q-card-actions vertical class="justify-around q-px-md">
                <q-btn
                    flat
                    round
                    color="cyan-8"
                    icon="edit"
                    v-if="havePermission('A002')"
                    @click="router.push(`/equipo/${idequipo}`)"
                >
                    <q-tooltip> Editar Equipo </q-tooltip>
                </q-btn>
                <q-btn
                    flat
                    round
                    style="color: #ec5454"
                    icon="delete"
                    v-if="havePermission('A003')"
                    @click="handleDeleteEquipo(idequipo)"
                >
                    <q-tooltip> Eliminar Equipo </q-tooltip>
                </q-btn>
            </q-card-actions>
        </q-card-section>
    </q-card>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { useEquipoStore } from "@/store/equipo";
import { havePermission } from "@/utils/utils";

const store = useEquipoStore();
const router = useRouter();

const handleDeleteEquipo = async (idequipo: number) => {
    await store.deleteEquipo(idequipo);
};

defineProps<{
    idequipo?: number;
    equipo?: string;
    entrenador?: string;
    categoria?: string;
    jugadores?: number;
}>();
</script>
