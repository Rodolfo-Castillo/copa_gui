<template>
    <div>
        <q-card>
            <q-card-section class="bg-primary text-white q-pa-sm">
                <div class="text-h6">Expulsiones</div>
            </q-card-section>
            <q-card-section>
                <q-breadcrumbs v-if="!expulsionesStore.isLoading">
                    <q-breadcrumbs-el label="Expulsiones" icon="home" />
                </q-breadcrumbs>
            </q-card-section>
            <q-card-section>
                <q-table
                    title="Partidos"
                    :rows="expulsionesStore.expulsados"
                    row-key="idjugador"
                    :columns="columns"
                    :filter="filter"
                    :rows-per-page-options="[0]"
                    hide-bottom
                >
                    <template v-slot:top-right>
                        <q-input
                            outlined
                            dense
                            v-model="filter"
                            placeholder="Search"
                        >
                            <template v-slot:append>
                                <q-icon name="search" />
                            </template>
                        </q-input>
                    </template>
                    <template v-slot:body-cell-suspendido="props">
                        <q-td :props="props">
                            <q-checkbox v-model="props.row.suspendido" />
                        </q-td>
                    </template>
                </q-table>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn
                    color="primary"
                    label="Guardar"
                    @click="
                        async () => {
                            await saveSuspendidos();
                        }
                    "
                />
            </q-card-actions>
        </q-card>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useExpulsionesStore } from "@/store/expulsiones";

const expulsionesStore = useExpulsionesStore();

const filter = ref(null);
const columns = <any>[
    {
        name: "nombres",
        required: true,
        field: "nombres",
        label: "Nombre Jugador",
        align: "center",
    },
    { name: "equipo", label: "Equipo", field: "equipo" },
    { name: "suspendido", label: "Suspendido", field: "suspendido" },
];

const saveSuspendidos = async () => {
    try {
        expulsionesStore.expulsados.map(async (expulsado: any) => {
            if (expulsado.suspendido == false)
                await expulsionesStore.updSuspendidos(expulsado.idjugador);
        });
    } catch (e: any) {
        console.error(e);
    }
};

onMounted(async () => {
    try {
        await expulsionesStore.listExpulsados();
    } catch (e: any) {
        console.error(e);
    }
});
</script>
