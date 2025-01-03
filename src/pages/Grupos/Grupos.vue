<template>
    <div>
        <q-card>
            <q-card-section class="bg-primary text-white q-pa-sm">
                <div class="text-h6">Grupos</div>
            </q-card-section>
            <q-card-section>
                <q-breadcrumbs v-if="!catalogoStore.isLoading">
                    <q-breadcrumbs-el label="Grupos" icon="home" />
                </q-breadcrumbs>
            </q-card-section>
            <q-card-section>
                <div class="q-gutter-md row justify-center">
                    <div class="col-3 col-md-2">
                        <div class="text-caption">Categoría</div>
                        <q-select
                            outlined
                            v-model="categoriaSelected"
                            :options="catalogoStore.categorias"
                            label="Categoría"
                            :disable="catalogoStore.isLoading"
                            dense
                            class="col-4"
                            hint="Seleccione una categoría."
                            option-value="idcategoria"
                            option-label="categoria"
                            :rules="[
                                (select) =>
                                    !!select || 'Categoría es obligatorio.',
                            ]"
                        />
                    </div>
                    <div class="col-1 col-md-1">
                        <q-btn
                            class="q-mt-lg"
                            flat
                            round
                            icon="search"
                            @click="handleGetEquipos"
                        >
                            <q-tooltip>Buscar equipos</q-tooltip>
                        </q-btn>
                    </div>
                </div>
                <div class="row q-gutter-md q-mt-md">
                    <div class="col-2 col-md-2">
                        <q-card>
                            <q-card-section class="bg-primary">
                                <div class="text-h6 text-white">Equipos</div>
                            </q-card-section>
                            <q-separator />
                            <q-card-section class="bg-grey-2">
                                <q-scroll-area
                                    :style="{
                                        height:
                                            teamWithOutGroup == 0
                                                ? `30px`
                                                : `300px`,
                                    }"
                                >
                                    <div
                                        class="drop-zone"
                                        @drop="onDrop($event, 0)"
                                        @dragenter.prevent
                                        @dragover.prevent
                                    >
                                        <div
                                            v-for="item in listZero"
                                            draggable="true"
                                            @dragstart="startDrag($event, item)"
                                            :key="item.idequipo"
                                            class="drag-el bg-cyan-8 text-white"
                                        >
                                            {{ item.equipo }}
                                        </div>
                                    </div>
                                </q-scroll-area>
                            </q-card-section>
                        </q-card>
                    </div>
                    <div class="col-2 col-md-2">
                        <q-card>
                            <q-card-section class="bg-primary">
                                <div class="text-h6 text-white">Grupo 1</div>
                            </q-card-section>
                            <q-separator />
                            <q-card-section class="bg-grey-2">
                                <div
                                    class="drop-zone"
                                    @drop="onDrop($event, 1)"
                                    @dragenter.prevent
                                    @dragover.prevent
                                >
                                    <div
                                        v-for="item in listOne"
                                        draggable="true"
                                        @dragstart="startDrag($event, item)"
                                        :key="item.idequipo"
                                        class="drag-el bg-cyan-8 text-white"
                                    >
                                        {{ item.equipo }}
                                    </div>
                                </div>
                            </q-card-section>
                        </q-card>
                    </div>
                    <div class="col-2 col-md-2">
                        <q-card>
                            <q-card-section class="bg-primary">
                                <div class="text-h6 text-white">Grupo 2</div>
                            </q-card-section>
                            <q-separator />
                            <q-card-section class="bg-grey-2">
                                <div
                                    class="drop-zone"
                                    @drop="onDrop($event, 2)"
                                    @dragenter.prevent
                                    @dragover.prevent
                                >
                                    <div
                                        v-for="item in listTwo"
                                        draggable="true"
                                        @dragstart="startDrag($event, item)"
                                        :key="item.idequipo"
                                        class="drag-el bg-cyan-8 text-white"
                                    >
                                        {{ item.equipo }}
                                    </div>
                                </div>
                            </q-card-section>
                        </q-card>
                    </div>
                    <div class="col-2 col-md-2">
                        <q-card>
                            <q-card-section class="bg-primary">
                                <div class="text-h6 text-white">Grupo 3</div>
                            </q-card-section>
                            <q-separator />
                            <q-card-section class="bg-grey-2">
                                <div
                                    class="drop-zone"
                                    @drop="onDrop($event, 3)"
                                    @dragenter.prevent
                                    @dragover.prevent
                                >
                                    <div
                                        v-for="item in listThree"
                                        draggable="true"
                                        @dragstart="startDrag($event, item)"
                                        :key="item.idequipo"
                                        class="drag-el bg-cyan-8 text-white"
                                    >
                                        {{ item.equipo }}
                                    </div>
                                </div>
                            </q-card-section>
                        </q-card>
                    </div>
                    <div class="col-2 col-md-2">
                        <q-card>
                            <q-card-section class="bg-primary">
                                <div class="text-h6 text-white">Grupo 4</div>
                            </q-card-section>
                            <q-separator />
                            <q-card-section class="bg-grey-2">
                                <div
                                    class="drop-zone"
                                    @drop="onDrop($event, 4)"
                                    @dragenter.prevent
                                    @dragover.prevent
                                >
                                    <div
                                        v-for="item in listFour"
                                        draggable="true"
                                        @dragstart="startDrag($event, item)"
                                        :key="item.idequipo"
                                        class="drag-el bg-cyan-8 text-white"
                                    >
                                        {{ item.equipo }}
                                    </div>
                                </div>
                            </q-card-section>
                        </q-card>
                    </div>
                </div>
            </q-card-section>
            <q-card-actions class="row justify-end">
                <q-btn
                    flat
                    label="Cancelar"
                    :disabled="gruposStore.isLoading || catalogoStore.isLoading"
                />
                <q-btn
                    color="primary"
                    label="Guardar"
                    :disabled="gruposStore.isLoading || catalogoStore.isLoading"
                    @click="handleSave()"
                />
            </q-card-actions>
        </q-card>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useCatalogoStore } from "@/store/catalogo";
import { useGruposStore } from "@/store/grupos";
import { showNotify } from "@/utils/utils";

const categoriaSelected = <any>ref(null);
const catalogoStore = useCatalogoStore();
const gruposStore = useGruposStore();

const items = <any>ref([]);

const listZero = computed(() => {
    return items.value.filter((item: any) => item.grupo === 0);
});

const listOne = computed(() => {
    return items.value.filter((item: any) => item.grupo === 1);
});

const listTwo = computed(() => {
    return items.value.filter((item: any) => item.grupo === 2);
});

const listThree = computed(() => {
    return items.value.filter((item: any) => item.grupo === 3);
});

const listFour = computed(() => {
    return items.value.filter((item: any) => item.grupo === 4);
});

const teamWithOutGroup = computed(() => {
    return items.value.some((item: any) => {
        return item.grupo === 0;
    });
});

const startDrag = (evt: any, item: any) => {
    evt.dataTransfer.dropEffect = "move";
    evt.dataTransfer.effectAllowed = "move";
    evt.dataTransfer.setData("itemID", item.idequipo);
};
const onDrop = (evt: any, grupo: any) => {
    const itemID = evt.dataTransfer.getData("itemID");
    const item = items.value.find((item: any) => item.idequipo == itemID);
    item.grupo = grupo;
};

const handleGetEquipos = async () => {
    try {
        await gruposStore.getEquiposCategoria(
            categoriaSelected.value.idcategoria
        );
        items.value = [];
        if (gruposStore.equipos != null) {
            items.value = gruposStore.equipos;
        }
    } catch (e: any) {
        console.error(e);
    }
};

const handleSave = async () => {
    const isValid = items.value.some((item: any) => {
        return item.grupo === 0;
    });
    if (!isValid) {
        await gruposStore.saveEquiposGrupos(items.value);
        showNotify({
            msg: "Datos guardados.",
            color: "positive",
            icon: "success",
        });
    } else {
        showNotify({
            msg: "Todos los equipos deben estar en algún grupo.",
            color: "negative",
            icon: "cancel",
        });
    }
};

onMounted(async () => {
    await catalogoStore.listCategorias();
});
</script>
