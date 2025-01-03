<template>
    <q-card>
        <q-card-section class="bg-primary text-white q-pa-sm">
            <div class="text-h6">Estadistica por Grupos</div>
        </q-card-section>
        <q-card-section>
            <q-breadcrumbs v-if="!estadisticaStore.isLoading">
                <q-breadcrumbs-el label="Estadisticas por Grupos" icon="home" />
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
                                await getGrupos();
                            }
                        "
                    />
                </div>
                <div class="col-5" style="text-align: right">
                    <q-btn
                        :disable="isDisabled()"
                        color="primary"
                        label="Exportar"
                        @click="exportarAPDF"
                    ></q-btn>
                </div>
            </div>
            <div class="row">
                <div
                    v-for="(grupo, i) in estadisticaStore.grupos"
                    :key="i"
                    class="col-6 q-pr-md q-pt-md"
                >
                    <q-table
                        :title="`Grupo ${i + 1}`"
                        :rows="grupo"
                        :columns="columns"
                        row-key="idequipoestadistica"
                        style="height: 310px"
                        hide-bottom
                        :rows-per-page-options="[0]"
                    >
                        <template v-slot:body-cell-posicion="props">
                            <q-td :props="props">
                                <q-icon
                                    v-if="
                                        props.row.posicion == 1 ||
                                        props.row.posicion == 2
                                    "
                                    name="check_circle"
                                    color="green"
                                />
                                {{ props.row.posicion }}
                            </q-td>
                        </template>
                    </q-table>
                </div>
                <q-icon class="q-pt-xs" name="check_circle" color="green" />
                Clasificados a fase final
            </div>
        </q-card-section>
    </q-card>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useEstadisticaStore } from "@/store/estadisticas";
import { useCatalogoStore } from "@/store/catalogo";
import { showNotify, validarToken } from "@/utils/utils";

const estadisticaStore = useEstadisticaStore();
const catalogoStore = useCatalogoStore();

const categoriaSelected = <any>ref(null);
const columns = <any>[
    {
        name: "posicion",
        required: true,
        label: "Posicion",
        field: "posicion",
        align: "center",
        sortable: true,
    },
    {
        name: "equipo",
        align: "center",
        label: "Equipo",
        field: "equipo",
        sortable: true,
    },
    {
        name: "partidosjugados",
        label: "JJ",
        field: "partidosjugados",
        sortable: true,
    },
    { name: "ganados", label: "G", field: "ganados", sortable: true },
    { name: "empatados", label: "E", field: "empatados", sortable: true },
    { name: "perdidos", label: "P", field: "perdidos", sortable: true },
    { name: "golesafavor", label: "GF", field: "golesafavor", sortable: true },
    {
        name: "golesencontra",
        label: "GC",
        field: "golesencontra",
        sortable: true,
    },
    {
        name: "diferenciadegoles",
        label: "DG",
        field: "diferenciadegoles",
        sortable: true,
    },
    {
        name: "puntos",
        label: "Pts",
        field: "puntos",
        sortable: true,
        style: "font-weight: bold;",
    },
];

const getGrupos = async () => {
    try {
        await estadisticaStore.getEstadisticaGrupos(
            categoriaSelected.value.idcategoria
        );
    } catch (e: any) {
        console.error(e.message);
    }
};

const isDisabled = (): boolean => {
    if (!categoriaSelected.value) return true;
    else return false;
};

const exportarAPDF = async () => {
    try {
        const data = await validarToken();
        if (data.valido) {
            const url =
                import.meta.env.VITE_REPORTS_HOST_API +
                `grupos/${categoriaSelected.value.idcategoria}`;
            window.open(url, "_blank");
        } else {
            showNotify({
                msg: "Algo salio mal.",
                color: "negative",
                icon: "cancel",
            });
        }
    } catch (e: any) {
        console.error(e.message);
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
