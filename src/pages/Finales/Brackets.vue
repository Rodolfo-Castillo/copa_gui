<template>
    <q-card>
        <q-card-section class="bg-primary text-white q-pa-sm">
            <div class="text-h6">Finales</div>
        </q-card-section>
        <q-card-section>
            <q-breadcrumbs
                v-if="!finalesStore.isLoading || !catalogoStore.isLoading"
            >
                <q-breadcrumbs-el label="Finales" icon="home" />
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
                            finalesStore.isLoading || catalogoStore.isLoading
                        "
                        dense
                        class="col-4"
                        hint="Seleccione una categoria."
                        option-value="idcategoria"
                        option-label="categoria"
                        @update:model-value="
                            async () => {
                                await getEquipos();
                            }
                        "
                    />
                </div>
                <div class="col-5"></div>
            </div>
            <div class="row">
                <div class="col-12">
                    <FinalBrackets :dataBracket="dataReplaced" :key="index" />
                </div>
            </div>
        </q-card-section>
    </q-card>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { onMounted } from "vue";
import { useFinalesStore } from "@/store/finales";
import { useCatalogoStore } from "@/store/catalogo";
import { getFinalsMatches } from "@/utils/utils";
import FinalBrackets from "@/components/FinalBrackets.vue";

const finalesStore = useFinalesStore();
const catalogoStore = useCatalogoStore();

const categoriaSelected = <any>ref(null);
const dataReplaced = <any>ref({
    rounds: [
        {
            name: "Cuartos de Final",
        },
        {
            name: "Semifinal",
        },
        {
            name: "Final",
        },
    ],
});
const index = ref(0);

const getEquipos = async () => {
    await finalesStore.addSiguientesCruces(categoriaSelected.value.idcategoria);
    await finalesStore.getPartidos(categoriaSelected.value.idcategoria);
    if (finalesStore.partidos.length > 0 && finalesStore.equipos.length > 0)
        dataReplaced.value = await getFinalsMatches(
            finalesStore.partidos,
            finalesStore.equipos
        );
    else
        dataReplaced.value = {
            rounds: [
                {
                    name: "Cuartos de Final",
                },
                {
                    name: "Semifinal",
                },
                {
                    name: "Final",
                },
            ],
        };

    console.log(dataReplaced.value);
    index.value++;
};

onMounted(async () => {
    try {
        await catalogoStore.listCategorias();
    } catch (e: any) {
        console.error(e);
    }
});
</script>
