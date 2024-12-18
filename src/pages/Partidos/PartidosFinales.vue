<template>
    <div>
        <q-card>
            <q-card-section class="bg-primary text-white q-pa-sm">
                <div class="text-h6">Partidos Fase Final</div>
            </q-card-section>
            <q-card-section>
                <q-breadcrumbs v-if="!partidosStore.isLoading">
                    <q-breadcrumbs-el label="Partidos Fase Final" icon="home" />
                </q-breadcrumbs>
            </q-card-section>
            <q-card-section>
                <q-table
                    bordered
                    separator="cell"
                    title="Partidos"
                    :rows="rows"
                    row-key="idpartido"
                    :columns="columns"
                >
                    <template v-slot:top="_props">
                        <q-select
                            outlined
                            v-model="categoriaSelected"
                            :options="catalogoStore.categorias"
                            label="Categoría"
                            :disable="
                                partidosStore.isLoading ||
                                catalogoStore.isLoading
                            "
                            dense
                            class="col-4"
                            hint="Seleccione una categoría."
                            option-value="idcategoria"
                            option-label="categoria"
                            @update:model-value="
                                async () => {
                                    await partidosStore.verificar(
                                        categoriaSelected.idcategoria
                                    );
                                }
                            "
                        />
                        <q-space></q-space>
                        <q-btn
                            @click="generarPartdios"
                            v-if="partidosStore.isValid"
                            color="primary"
                        >
                            Generar Partido</q-btn
                        >
                    </template>
                    <q-separator></q-separator>
                    <template v-slot:body="props">
                        <q-tr :props="props">
                            <q-td key="local" :props="props">{{
                                props.row.local
                            }}</q-td>
                            <q-td key="vs" :props="props">{{
                                props.row.vs
                            }}</q-td>
                            <q-td key="visitante" :props="props">{{
                                props.row.visitante
                            }}</q-td>
                            <q-td key="categoria" :props="props">{{
                                props.row.categoria
                            }}</q-td>
                            <q-td key="fase" :props="props">{{
                                props.row.fase
                            }}</q-td>
                            <q-td
                                key="fecha"
                                :props="props"
                                style="cursor: pointer"
                            >
                                {{ props.row.fecha }}
                                <q-popup-edit
                                    v-model="props.row.fecha"
                                    buttons
                                    v-slot="scope"
                                >
                                    <q-date
                                        v-model="scope.value"
                                        mask="YYYY-MM-DD"
                                    >
                                    </q-date>
                                </q-popup-edit>
                            </q-td>
                            <q-td
                                key="hora"
                                :props="props"
                                style="cursor: pointer"
                            >
                                {{ props.row.hora }}
                                <q-popup-edit
                                    v-model="props.row.hora"
                                    buttons
                                    v-slot="scope"
                                >
                                    <q-time v-model="scope.value" />
                                </q-popup-edit>
                            </q-td>
                            <q-td
                                key="cancha"
                                :props="props"
                                style="cursor: pointer"
                            >
                                {{ props.row.cancha }}
                                <q-popup-edit
                                    v-model="props.row.cancha"
                                    title="Escriba la lugar del partido"
                                    buttons
                                    v-slot="scope"
                                >
                                    <q-input
                                        v-model="scope.value"
                                        dense
                                        maxlength="50"
                                        autofocus
                                        counter
                                        @keyup.enter="scope.set"
                                    />
                                </q-popup-edit>
                            </q-td>
                        </q-tr>
                    </template>
                </q-table>
            </q-card-section>
            <q-card-actions align="right">
                <!-- <q-btn icon="visibility" color="primary" flat round @click="getJugador(props.row)">
                    <q-tooltip> Ver Jugador De La Plantilla </q-tooltip>
                </q-btn> -->
                <q-btn
                    :disable="isDisabled()"
                    color="primary"
                    label="Guardar Horario"
                    @click="SaveHorario"
                >
                    <q-tooltip> Guardar </q-tooltip>
                </q-btn>
            </q-card-actions>
        </q-card>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { usePartidosFinalesStore } from "@/store/partidosfinales";
import { useCatalogoStore } from "@/store/catalogo";
import { showNotify } from "@/utils/utils";

const partidosStore = usePartidosFinalesStore();
const catalogoStore = useCatalogoStore();

const categoriaSelected = <any>ref(null);

const columns = <any>[
    {
        name: "local",
        required: true,
        field: "local",
        label: "Equipo Local",
        align: "left",
    },
    {
        name: "vs",
        align: "center",
        label: "VS",
        field: "vs",
    },
    {
        name: "visitante",
        label: "Equipo Visitante",
        field: "visitante",
    },
    { name: "categoria", label: "Categoría", field: "categoria" },
    { name: "fase", label: "Fase", field: "fase" },
    { name: "fecha", label: "Fecha", field: "fecha" },
    { name: "hora", label: "Hora", field: "hora" },
    { name: "cancha", label: "Lugar", field: "cancha" },
];
const rows = ref([]);

const generarPartdios = async () => {
    try {
        await partidosStore.getEquipos(categoriaSelected.value.idcategoria);
        showNotify({
            msg: "Partidos Generados.",
            color: "positive",
            icon: "success",
        });
        rows.value = partidosStore.partidos;
    } catch (e) {
        console.error(e);
    }
};

const listPartidos = async () => {
    try {
        await partidosStore.listPartidos();
        rows.value = partidosStore.partidos;
    } catch (e: any) {
        console.error(e);
    }
};

const isDisabled = (): boolean => {
    if (rows.value.length == 0) return true;
    const isValid = rows.value.some((partido: any) => {
        return partido.hora == null || partido.cancha == null;
    });
    return isValid;
};

const SaveHorario = () => {
    try {
        rows.value.map(async (partido: any) => {
            const formData = {
                fecha: partido.fecha,
                hora: partido.hora,
                cancha: partido.cancha,
            };
            console.log(formData);
            await partidosStore.setHorarioPartido(
                partido.idpartidoliguilla,
                formData
            );
        });
        showNotify({
            msg: "Datos guardados.",
            color: "positive",
            icon: "success",
        });
        listPartidos();
    } catch (e: any) {
        console.error(e);
    }
};

onMounted(async () => {
    try {
        await catalogoStore.listCategorias();
        await listPartidos();
    } catch (e: any) {
        console.error(e);
    }
});
</script>
