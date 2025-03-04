<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated class="bg-cyan-8">
            <q-toolbar> </q-toolbar>
        </q-header>
        <q-page-container>
            <q-page class="q-pa-md">
                <q-card flat bordered class="q-pa-md">
                    <q-card-section>
                        <div class="text-h5">
                            Resultados de Torneos de Fútbol
                        </div>
                    </q-card-section>

                    <q-card-section>
                        <q-select
                            outlined
                            v-model="copaSelected"
                            :options="publicoStore.copas"
                            label="Copa"
                            :disable="publicoStore.isLoading"
                            dense
                            class="col-4"
                            hint="Seleccione una copa."
                            option-value="idcopa"
                            option-label="copa"
                            @update:model-value="
                                async () => {
                                    await getCategorias();
                                }
                            "
                        />
                        <q-select
                            outlined
                            v-model="categoriaSelected"
                            :options="publicoStore.categorias"
                            label="Categoría"
                            :disable="
                                publicoStore.isLoading || copaSelected == null
                            "
                            dense
                            class="col-4"
                            hint="Seleccione una categoría."
                            option-value="idcategoria"
                            option-label="categoria"
                            @update:model-value="
                                async () => {
                                    await getEquipos();
                                }
                            "
                        />
                        <q-select
                            outlined
                            v-model="equipoSelected"
                            :options="publicoStore.equipos"
                            label="Equipos"
                            :disable="
                                publicoStore.isLoading ||
                                categoriaSelected == null
                            "
                            dense
                            class="col-4"
                            hint="Seleccione un equipo."
                            option-value="idequipo"
                            option-label="equipo"
                        />
                    </q-card-section>
                    <q-card-actions align="right">
                        <q-btn color="primary">Buscar</q-btn>
                    </q-card-actions>
                    <q-card-section> </q-card-section>
                </q-card>
            </q-page>
        </q-page-container>
    </q-layout>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { usePublicoStore } from "@/store/publico";

const publicoStore = usePublicoStore();

const copaSelected = ref(null);
const categoriaSelected = ref(null);
const equipoSelected = ref(null);

const searchQuery = ref("");
const selectedDate = ref(null);
const dates = ["2025-01-21", "2025-01-22", "2025-01-23"]; // Ejemplo de fechas
const results = [
    {
        id: 1,
        date: "2025-01-21",
        team1: "Equipo A",
        team2: "Equipo B",
        team1Score: 2,
        team2Score: 1,
    },
    {
        id: 2,
        date: "2025-01-22",
        team1: "Equipo C",
        team2: "Equipo D",
        team1Score: 0,
        team2Score: 3,
    },
    {
        id: 3,
        date: "2025-01-23",
        team1: "Equipo E",
        team2: "Equipo F",
        team1Score: 1,
        team2Score: 1,
    },
];
const columns = ref(<any>[
    {
        name: "date",
        required: true,
        label: "Fecha",
        align: "left",
        field: "date",
    },
    { name: "team1", label: "Equipo 1", align: "left", field: "team1" },
    { name: "score", label: "Resultado", align: "center" },
    { name: "team2", label: "Equipo 2", align: "left", field: "team2" },
]);

const getCategorias = async () => {
    try {
        await publicoStore.listPublicoCategorias(copaSelected.value.idcopa);
    } catch (e: any) {
        console.error(e);
    }
};

const getEquipos = async () => {
    try {
        await publicoStore.listPublicoEquipos(
            copaSelected.value.idcopa,
            categoriaSelected.value.idcategoria
        );
    } catch (e: any) {
        console.error(e);
    }
};

const filteredResults = computed(() => {
    return results.filter((result) => {
        const matchesQuery =
            searchQuery.value === "" ||
            result.team1
                .toLowerCase()
                .includes(searchQuery.value.toLowerCase()) ||
            result.team2
                .toLowerCase()
                .includes(searchQuery.value.toLowerCase());
        const matchesDate = !selectedDate || result.date === selectedDate.value;
        return matchesQuery && matchesDate;
    });
});

onMounted(async () => {
    try {
        await publicoStore.listPublicoCopas();
    } catch (e: any) {
        console.error(e);
    }
});
</script>
<style scoped>
.text-h5 {
    font-weight: bold;
}
</style>
