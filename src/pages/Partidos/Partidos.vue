<template>
    <div>
        <q-card>
            <q-card-section class="bg-primary text-white q-pa-sm">
                <div class="text-h6">Partidos</div>
            </q-card-section>
            <q-card-section>
                <q-breadcrumbs v-if="!partidosStore.isLoading">
                    <q-breadcrumbs-el label="Partidos" icon="home" />
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
                        <q-space></q-space>
                        <q-btn
                            @click="generarPartidos"
                            v-if="partidosStore.partidos == null"
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
                                        autofocus
                                        maxlength="50"
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
                    color="primary"
                    label="Ver Rol"
                    v-if="isDisabled()"
                    @click="VerRol"
                >
                    <q-tooltip> Ver Rol </q-tooltip>
                </q-btn>
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
import { usePartidosStore } from "@/store/partidos";
import { useCatalogoStore } from "@/store/catalogo";
import { showNotify, validarToken } from "@/utils/utils";

const partidosStore = usePartidosStore();
const catalogoStore = useCatalogoStore();

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
    { name: "fecha", label: "Fecha", field: "fecha" },
    { name: "hora", label: "Hora", field: "hora" },
    { name: "cancha", label: "Lugar", field: "cancha" },
];
const rows = ref([]);

const generarPartidos = async () => {
    try {
        await catalogoStore.listCategorias();
        await Promise.all(
            catalogoStore.categorias.map(async (categoria: any) => {
                await partidosStore.getEquipos(categoria.idcategoria);
            })
        );
        showNotify({
            msg: "Partidos Generados.",
            color: "positive",
            icon: "success",
        });
        await listPartidos();
    } catch (e) {
        console.error(e);
    }
};

const listPartidos = async () => {
    try {
        await partidosStore.listPartidos();
        rows.value = [];
        if (partidosStore.partidos != null) rows.value = partidosStore.partidos;
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
            await partidosStore.setHorarioPartido(partido.idpartido, formData);
            showNotify({
                msg: "Datos guardados.",
                color: "positive",
                icon: "success",
            });
        });
    } catch (e: any) {
        console.error(e);
    }
};

const VerRol = async () => {
    try {
        const data = await validarToken();
        if (data.valido) {
            const url = import.meta.env.VITE_REPORTS_HOST_API + "rol";
            window.open(url, "_blank");
        }
    } catch (e: any) {
        console.error(e);
    }
};

onMounted(async () => {
    try {
        await listPartidos();
    } catch (e: any) {
        console.error(e);
    }
});
</script>
