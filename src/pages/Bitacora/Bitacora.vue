<template>
    <div>
        <q-card>
            <q-card-section class="bg-primary text-white q-pa-sm">
                <div class="text-h6">Bitácora</div>
            </q-card-section>
            <q-card-section>
                <q-breadcrumbs v-if="!bitacoraStore.isLoading">
                    <q-breadcrumbs-el label="Bitácora" icon="home" />
                </q-breadcrumbs>
            </q-card-section>
            <q-card-section>
                <q-table
                    title="Bitácora de Movimientos"
                    :rows="bitacoraStore.bitacora"
                    :columns="columns"
                    row-key="idbitacoramovimiento"
                    hide-bottom
                    :rows-per-page-options="[0]"
                >
                </q-table>
            </q-card-section>
        </q-card>
    </div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { useBitacoraStore } from "@/store/bitacora";

const bitacoraStore = useBitacoraStore();
const columns = <any>[
    {
        name: "movimiento",
        required: true,
        label: "Acción Realizada",
        field: "movimiento",
        align: "left",
        sortable: true,
    },
    {
        name: "modificado",
        align: "left",
        label: "¿Que se modificó?",
        field: "modificado",
        sortable: true,
    },
    {
        name: "fecha",
        label: "Fecha de modificación",
        field: "fecha",
        sortable: true,
        align: "left",
    },
    {
        name: "usuario",
        label: "Usuario que modificó",
        field: "usuario",
        sortable: true,
        align: "left",
    },
];

onMounted(async () => {
    await bitacoraStore.listBitacora();
});
</script>
