<template>
    <q-card>
        <q-card-section class="bg-primary text-white q-pa-sm">
            <div class="text-h6">Estadísticas Individuales</div>
        </q-card-section>
        <q-card-section>
            <q-breadcrumbs v-if="!estadisticaStore.isLoading">
                <q-breadcrumbs-el
                    label="Estadísticas por Individuales"
                    icon="home"
                />
            </q-breadcrumbs>
        </q-card-section>
        <q-card-section>
            <div class="row">
                <div class="col-5"></div>
                <div class="col-2">
                    <q-select
                        outlined
                        v-model="categoriaSelected"
                        :options="catalogoStore.categorias"
                        label="Categoría"
                        :disable="
                            estadisticaStore.isLoading ||
                            catalogoStore.isLoading
                        "
                        dense
                        class="col-4"
                        hint="Seleccione una categoría."
                        option-value="idcategoria"
                        option-label="categoria"
                        @update:model-value="
                            async () => {
                                await getInfo();
                            }
                        "
                    />
                </div>
                <div class="col-5"></div>
            </div>
            <div class="row">
                <q-splitter
                    v-model="splitterModel"
                    style="height: 100%; width: 100%"
                >
                    <template v-slot:before>
                        <q-tabs
                            v-model="tab"
                            vertical
                            class="text-teal"
                            @update:model-value="getInfo"
                        >
                            <q-tab
                                name="goleador"
                                icon="sports_soccer"
                                label="Goleador"
                            />
                            <q-tab
                                name="portero"
                                icon="pan_tool"
                                label="Porterias En 0"
                            />
                            <q-tab
                                name="expulsiones"
                                icon="crop_portrait"
                                label="Mas Expulsados"
                            />
                        </q-tabs>
                    </template>
                    <template v-slot:after>
                        <q-tab-panels
                            v-model="tab"
                            animated
                            swipeable
                            vertical
                            transition-prev="jump-up"
                            transition-next="jump-up"
                        >
                            <q-tab-panel name="goleador">
                                <div class="text-h4 q-mb-md">
                                    Campeon goleador
                                </div>
                                <q-table
                                    title="Goleadores"
                                    :rows="estadisticaStore.goleadores"
                                    :columns="columnsGoleador"
                                    row-key="idequipoestadistica"
                                    style="height: 100%"
                                    hide-bottom
                                    :rows-per-page-options="[0]"
                                >
                                    <template v-slot:body-cell-posicion="props">
                                        <q-td :props="props">
                                            <q-icon
                                                v-if="props.row.posicion == 1"
                                                name="emoji_events"
                                                color="yellow"
                                            />
                                            {{ props.row.posicion }}
                                        </q-td>
                                    </template>
                                </q-table>
                            </q-tab-panel>

                            <q-tab-panel name="portero">
                                <div class="text-h4 q-mb-md">
                                    Portero menos goleado
                                </div>
                                <q-table
                                    title="Porteros"
                                    :rows="estadisticaStore.porteros"
                                    :columns="columnsPorteros"
                                    row-key="idequipoestadistica"
                                    style="height: 100%"
                                    hide-bottom
                                    :rows-per-page-options="[0]"
                                >
                                    <template v-slot:body-cell-posicion="props">
                                        <q-td :props="props">
                                            <q-icon
                                                v-if="props.row.posicion == 1"
                                                name="emoji_events"
                                                color="yellow"
                                            />
                                            {{ props.row.posicion }}
                                        </q-td>
                                    </template>
                                </q-table>
                            </q-tab-panel>

                            <q-tab-panel name="expulsiones">
                                <div class="text-h4 q-mb-md">Expulsiones</div>
                                <q-table
                                    title="Expulsiones"
                                    :rows="estadisticaStore.expulsiones"
                                    :columns="columnsExpulsion"
                                    row-key="idjugador"
                                    style="height: 100%"
                                    hide-bottom
                                    :rows-per-page-options="[0]"
                                />
                            </q-tab-panel>
                        </q-tab-panels>
                    </template>
                </q-splitter>
            </div>
            <q-icon
                name="emoji_events"
                color="yellow"
                v-if="tab === 'goleador' || tab === 'portero'"
            />
            {{
                tab === "goleador" || tab === "portero"
                    ? "Ganador de trofeo"
                    : ""
            }}
        </q-card-section>
    </q-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useEstadisticaStore } from "@/store/estadisticas";
import { useCatalogoStore } from "@/store/catalogo";

const estadisticaStore = useEstadisticaStore();
const catalogoStore = useCatalogoStore();

const categoriaSelected = <any>ref(null);
const tab = ref("goleador");
const splitterModel = ref(20);
const columnsGoleador = <any>[
    {
        name: "posicion",
        required: true,
        label: "Posicion",
        field: "posicion",
        align: "center",
        sortable: true,
        style: "width: 5%",
    },
    {
        name: "nombre",
        align: "left",
        label: "Nombre",
        field: "nombre",
        sortable: true,
        style: "width: 50%",
    },
    {
        name: "equipo",
        align: "left",
        label: "Equipo",
        field: "equipo",
        sortable: true,
        style: "width: 40%",
    },
    {
        name: "goles",
        align: "center",
        label: "Goles",
        field: "goles",
        sortable: true,
        style: "width: 5%;font-weight: bold;",
    },
];

const columnsPorteros = <any>[
    {
        name: "posicion",
        required: true,
        label: "Posicion",
        field: "posicion",
        align: "center",
        sortable: true,
        style: "width: 5%",
    },
    {
        name: "nombre",
        align: "left",
        label: "Nombre",
        field: "nombre",
        sortable: true,
        style: "width: 80%",
    },
    {
        name: "equipo",
        align: "left",
        label: "Equipo",
        field: "equipo",
        sortable: true,
        style: "width: 80%",
    },
    {
        name: "porteriasen0",
        align: "center",
        label: "Porterias en 0",
        field: "porteriasen0",
        sortable: true,
        style: "width: 5%",
    },
    {
        name: "golesrecibidos",
        align: "center",
        label: "Goles Recibidos",
        field: "golesrecibidos",
        sortable: true,
        style: "width: 5%;font-weight: bold;",
    },
];

const columnsExpulsion = <any>[
    {
        name: "posicion",
        required: true,
        label: "Posicion",
        field: "posicion",
        align: "center",
        sortable: true,
        style: "width: 5%",
    },
    {
        name: "nombre",
        align: "left",
        label: "Nombre",
        field: "nombre",
        sortable: true,
        style: "width: 80%",
    },
    {
        name: "equipo",
        align: "left",
        label: "Equipo",
        field: "equipo",
        sortable: true,
        style: "width: 80%",
    },
    {
        name: "expulsiones",
        align: "center",
        label: "Expulsiones",
        field: "expulsiones",
        sortable: true,
        style: "width: 5%",
    },
];

const getInfo = async () => {
    if (categoriaSelected.value) {
        if (tab.value == "goleador")
            await estadisticaStore.getEstadisticaGoleador(
                categoriaSelected.value.idcategoria
            );
        if (tab.value == "portero")
            await estadisticaStore.getEstadisticaPortero(
                categoriaSelected.value.idcategoria
            );
        if (tab.value == "expulsiones")
            await estadisticaStore.getEstadisticaExpulsion(
                categoriaSelected.value.idcategoria
            );
    }
};

onMounted(async () => {
    try {
        await catalogoStore.listCategorias();
    } catch (e: any) {
        console.error(e);
    }
});
</script>
