<template>
    <div>
        <q-card>
            <q-card-section class="bg-primary text-white q-pa-sm">
                <div class="text-h6">Resultados</div>
            </q-card-section>
            <q-card-section>
                <q-breadcrumbs v-if="!resultadosStore.isLoading">
                    <q-breadcrumbs-el label="Resultados" icon="home" />
                </q-breadcrumbs>
            </q-card-section>
            <q-card-section>
                <q-table
                    bordered
                    title="Resultados"
                    :rows="resultadosStore.resultados"
                    row-key="idpartido"
                    :columns="columns"
                    :rows-per-page-options="[0]"
                >
                    <template v-slot:header="props">
                        <q-tr :props="props">
                            <q-th auto-width />
                            <q-th
                                v-for="col in props.cols"
                                :key="col.name"
                                :props="props"
                            >
                                {{ col.label }}
                            </q-th>
                            <q-th auto-width />
                        </q-tr>
                    </template>
                    <template v-slot:body="props">
                        <q-tr :props="props">
                            <q-td auto-width>
                                <q-btn
                                    v-if="props.row.jugado"
                                    size="sm"
                                    color="primary"
                                    round
                                    dense
                                    :disable="resultadosStore.isLoading"
                                    @click="
                                        async () => {
                                            if (!props.expand)
                                                await expandRow(
                                                    props.row.idpartido
                                                );
                                            props.expand = !props.expand;
                                        }
                                    "
                                    :icon="
                                        props.expand
                                            ? 'keyboard_arrow_up'
                                            : 'keyboard_arrow_down'
                                    "
                                />
                            </q-td>
                            <q-td
                                v-for="col in props.cols"
                                :key="col.name"
                                :props="props"
                            >
                                {{ col.value }}
                            </q-td>
                            <q-td>
                                <q-btn
                                    v-if="!props.row.jugado"
                                    flat
                                    round
                                    dense
                                    icon="edit"
                                    color="grey"
                                    @click="
                                        router.push(
                                            `/resultado/${props.row.idpartido}`
                                        )
                                    "
                                >
                                    <q-tooltip>Guardar Resultado</q-tooltip>
                                </q-btn>
                            </q-td>
                        </q-tr>
                        <q-tr v-show="props.expand" :props="props">
                            <q-td colspan="100%">
                                <FormExpandRow
                                    :info="resultadosStore.infoPartido"
                                />
                            </q-td>
                        </q-tr>
                    </template>
                </q-table>
            </q-card-section>
        </q-card>
    </div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { useResultadosStore } from "@/store/resultados";
import { useRouter } from "vue-router";
import FormExpandRow from "@/components/FormExpandRow.vue";

const resultadosStore = useResultadosStore();
const router = useRouter();

const columns = <any>[
    {
        name: "local",
        required: true,
        field: "local",
        label: "Equipo Local",
        align: "left",
        style: "width: 20%;",
    },
    {
        name: "vs",
        align: "center",
        label: "VS",
        field: "vs",
        style: "width: 10%;",
    },
    {
        name: "visitante",
        label: "Equipo Visitante",
        field: "visitante",
        style: "width: 20%;",
    },
    {
        name: "categoria",
        label: "Categoría",
        field: "categoria",
        style: "width: 20%;",
    },
    { name: "hora", label: "Hora", field: "hora", style: "width: 10%;" },
    { name: "cancha", label: "Lugar", field: "cancha", style: "width: 20%;" },
];

const expandRow = async (idpartido: number) => {
    try {
        await resultadosStore.getResultadoFinalInfo(idpartido);
    } catch (e: any) {
        console.error(e);
    }
};

onMounted(async () => {
    try {
        await resultadosStore.listResultados();
    } catch (e: any) {
        console.error(e);
    }
});
</script>
