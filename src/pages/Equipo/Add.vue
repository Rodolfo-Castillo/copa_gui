<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { useEquipoStore } from "@/store/equipo";
import { useCatalogoStore } from "@/store/catalogo";
import FormSkeleton from "@/components/FormSkeleton.vue";
import { useRouter, useRoute } from "vue-router";
import {
    DateRange,
    showNotify,
    urlToFile,
    transformarBitToBoolean,
} from "@/utils/utils";
import { EquipoInterface } from "@/utils/interfaces";
import ImagePreview from "@/components/ImagePreview.vue";

const router = useRouter();
const route = useRoute();
const formJugadoresAPlantilla = ref(null);
const formEquipo = ref(null);
const openPreview = ref(false);
const previewImage = ref(null);

const equipoStore = useEquipoStore();
const catalogoStore = useCatalogoStore();
const buscar = ref(null);
const columns = <any>[
    {
        name: "nombres",
        align: "center",
        label: "Nombres:",
        field: "nombres",
        sortable: true,
    },
    {
        name: "paterno",
        align: "center",
        label: "Apellido Paterno:",
        field: "paterno",
        sortable: true,
    },
    {
        name: "materno",
        align: "center",
        label: "Apellido Materno:",
        field: "materno",
        sortable: true,
    },
    {
        name: "fechanacimiento",
        label: "Fecha de Nacimiento:",
        field: "fechanacimiento",
        sortable: true,
    },
];

let plantilla = <any>ref([]);
const index = ref(0);
const paterno = ref(null);
const nombres = ref(null);
const materno = ref(null);
const fechanacimiento = ref(null);
const foto = ref(null);
const isEdit = ref(false);

const categoriaSelected = <any>ref(null);
const sexoSelected = <any>ref(null);
const esPortero = ref(false);

const formData = <EquipoInterface>reactive({
    idequipo: 0,
    equipo: "",
    entrenador: "",
    idcategoria: null,
});

const agregarJugadorAPlantilla = async () => {
    const isValid = await formJugadoresAPlantilla.value.validate();

    if (isValid && foto.value != null) {
        index.value++;
        const sexo = catalogoStore.sexos.filter(
            (sexo) => sexo.idsexo == sexoSelected.value.idsexo
        )[0];
        if (route.params.idequipo) {
            plantilla.value = [
                ...plantilla.value,
                {
                    nombres: nombres.value,
                    paterno: paterno.value,
                    materno: materno.value,
                    fechanacimiento: fechanacimiento.value,
                    idsexo: sexo.idsexo,
                    foto: foto.value[0],
                    idequipo: route.params.idequipo,
                    esportero: esPortero.value === true ? 1 : 0,
                },
            ];
        } else {
            plantilla.value = [
                ...plantilla.value,
                {
                    nombres: nombres.value,
                    paterno: paterno.value,
                    materno: materno.value,
                    fechanacimiento: fechanacimiento.value,
                    idsexo: sexo.idsexo,
                    foto: foto.value[0],
                    esportero: esPortero.value === true ? 1 : 0,
                },
            ];
        }
        resetFormPlantilla();
        formJugadoresAPlantilla.value.reset();
        isEdit.value = false;
    } else {
        showNotify({
            msg: "Datos faltantes.",
            color: "negative",
            icon: "cancel",
        });
    }
};

const resetFormPlantilla = async () => {
    nombres.value = null;
    paterno.value = null;
    materno.value = null;
    fechanacimiento.value = null;
    sexoSelected.value = null;
    esPortero.value = false;
};

const handleSave = async () => {
    const isValid = await formEquipo.value.validate();
    if (isValid) {
        try {
            if (route.params.idequipo) {
                await equipoStore.updJugadorEquipo(plantilla.value);
            } else {
                const categoria = catalogoStore.categorias.filter(
                    (categoria: any) =>
                        categoria.idcategoria ==
                        categoriaSelected.value.idcategoria
                )[0];
                formData.idcategoria = categoria.idcategoria;
                await equipoStore.addEquipo(formData, plantilla.value);
            }
            router.push("/");
            showNotify({
                msg: "Datos guardados.",
                color: "positive",
                icon: "success",
            });
        } catch (e: any) {
            console.error(e);
        }
    } else {
        showNotify({
            msg: "Datos faltantes.",
            color: "negative",
            icon: "cancel",
        });
    }
    // await equipoStore.saveProduct(formData);
};

const handleDeleteJugador = async (idjugador: number) => {
    await equipoStore.deleteJugador(idjugador);
    plantilla.value = equipoStore.equipo.jugadores;
};

const getJugador = async (jugador: any) => {
    nombres.value = jugador.nombres;
    paterno.value = jugador.paterno;
    materno.value = jugador.materno;
    fechanacimiento.value = jugador.fechanacimiento;
    sexoSelected.value = catalogoStore.sexos.filter(
        (sexo) => sexo.idsexo == jugador.idsexo
    )[0];
    foto.value = await urlToFile(
        `${import.meta.env.VITE_HOST_API}imagen/${jugador.foto}/`,
        jugador.foto
    );
    (previewImage.value = `${import.meta.env.VITE_HOST_API}imagen/${
        jugador.foto
    }/`),
        jugador.foto;
    esPortero.value = transformarBitToBoolean(jugador.esportero);
    isEdit.value = true;
};

onMounted(async () => {
    await catalogoStore.listCategorias();
    await catalogoStore.listSexos();
    if (route.params.idequipo) {
        await equipoStore.getEquipo(+route.params.idequipo);
        formData.idequipo = equipoStore.equipo.idequipo;
        formData.equipo = equipoStore.equipo.equipo;
        formData.entrenador = equipoStore.equipo.entrenador;
        categoriaSelected.value = catalogoStore.categorias.filter(
            (categoria) =>
                categoria.idcategoria == equipoStore.equipo.idcategoria
        )[0];
        if (
            equipoStore.equipo.jugadores !== null &&
            equipoStore.equipo.jugadores.length > 0
        ) {
            plantilla.value = equipoStore.equipo.jugadores;
        }
    }
});
</script>
<template>
    <q-card v-if="!equipoStore.isLoading && !catalogoStore.isLoading">
        <q-form :greedy="true" ref="formEquipo">
            <q-card-section class="bg-secondary text-white q-pa-sm">
                <div class="text-h6">Equipo</div>
            </q-card-section>
            <q-card-section>
                <q-breadcrumbs>
                    <q-breadcrumbs-el
                        label="Equipos"
                        icon="home"
                        @click="router.push('/')"
                        style="cursor: pointer"
                    />
                    <q-breadcrumbs-el label="Equipo" style="cursor: pointer" />
                    <!-- <q-breadcrumbs-el
                        :label="!route.params.id ? 'Add' : 'Edit'"
                    /> -->
                </q-breadcrumbs>
            </q-card-section>
            <q-separator />
            <q-card-section class="row">
                <div class="col-3 text-weight-medium">Equipo</div>
                <div class="col-9 q-gutter-md">
                    <h6>Sección 1 - AGREGAR EQUIPO</h6>
                    <div class="row">
                        <div class="col-3">
                            <div class="text-caption">Equipo</div>
                            <q-input
                                outlined
                                v-model="formData.equipo"
                                label="Equipo"
                                dense
                                :disabled="
                                    equipoStore.isLoading ||
                                    catalogoStore.isLoading
                                "
                                hint="Equipo es obligatorio."
                                :rules="[
                                    (val) => !!val || 'Equipo es obligatorio.',
                                ]"
                            />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-3">
                            <div class="text-caption">Entrenador</div>
                            <q-input
                                outlined
                                v-model="formData.entrenador"
                                label="Entrenador"
                                dense
                                :disabled="
                                    equipoStore.isLoading ||
                                    catalogoStore.isLoading
                                "
                                hint="Entrenador es obligatorio."
                                :rules="[
                                    (val) =>
                                        !!val || 'Entrenador es obligatorio.',
                                ]"
                            />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-3">
                            <div class="text-caption">Categoria</div>
                            <q-select
                                outlined
                                v-model="categoriaSelected"
                                :options="catalogoStore.categorias"
                                label="Categoria"
                                :disable="
                                    equipoStore.isLoading ||
                                    catalogoStore.isLoading
                                "
                                dense
                                class="col-4"
                                hint="Seleccione una categoria."
                                option-value="idcategoria"
                                option-label="categoria"
                                :rules="[
                                    (select) =>
                                        !!select || 'Categoria es obligatorio.',
                                ]"
                            />
                        </div>
                    </div>
                </div>
            </q-card-section>
            <q-separator />
            <q-card-section class="row">
                <div class="col-3 text-weight-medium">Jugadores</div>
                <div class="col-9 q-gutter-md">
                    <q-form
                        ref="formJugadoresAPlantilla"
                        @submit.prevent="agregarJugadorAPlantilla"
                    >
                        <h6>Sección 2 - AGREGAR JUGADORES A LA PLANTILLA</h6>
                        <div class="row">
                            <div class="col-3">
                                <div class="text-caption">Fotografia</div>
                                <q-file
                                    v-model="foto"
                                    label="Seleccione una imágen"
                                    filled
                                    max-files="1"
                                    :disable="
                                        equipoStore.isLoading ||
                                        catalogoStore.isLoading ||
                                        isEdit
                                    "
                                    multiple
                                    style="max-width: 300px"
                                >
                                    <template v-slot:prepend>
                                        <q-icon name="attach_file" />
                                    </template>
                                </q-file>
                                <q-btn
                                    v-if="previewImage != null"
                                    class="q-mt-xs"
                                    color="info"
                                    label="Ver Imágen"
                                    @click="openPreview = true"
                                />
                                <!-- <ProfilePhoto ref="profilePhoto" v-model="foto"/> -->
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-3">
                                <div class="text-caption">Nombres</div>
                                <q-input
                                    outlined
                                    v-model="nombres"
                                    label="Nombres"
                                    dense
                                    :disable="
                                        equipoStore.isLoading ||
                                        catalogoStore.isLoading ||
                                        isEdit
                                    "
                                    hint="Nombres es obligatorio."
                                    :rules="[
                                        (val) =>
                                            !!val || 'Equipo es obligatorio.',
                                    ]"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-3">
                                <div class="text-caption">Apellido Paterno</div>
                                <q-input
                                    outlined
                                    v-model="paterno"
                                    label="Apellido Paterno"
                                    dense
                                    :disable="
                                        equipoStore.isLoading ||
                                        catalogoStore.isLoading ||
                                        isEdit
                                    "
                                    hint="Apellido Paterno es obligatorio."
                                    :rules="[
                                        (val) =>
                                            !!val ||
                                            'Apellido Paterno es obligatorio.',
                                    ]"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-3">
                                <div class="text-caption">Materno</div>
                                <q-input
                                    outlined
                                    v-model="materno"
                                    label="Apellido Materno"
                                    dense
                                    :disable="
                                        equipoStore.isLoading ||
                                        catalogoStore.isLoading ||
                                        isEdit
                                    "
                                    hint="Apellido Materno es obligatorio."
                                    :rules="[
                                        (val) =>
                                            !!val ||
                                            'Apellido Matenro es obligatorio.',
                                    ]"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-3">
                                <div class="text-caption">
                                    Fecha De Nacimiento
                                </div>
                                <q-input
                                    dense
                                    outlined
                                    v-model="fechanacimiento"
                                    mask="date"
                                    :rules="['date']"
                                    :disable="
                                        equipoStore.isLoading ||
                                        catalogoStore.isLoading ||
                                        isEdit
                                    "
                                >
                                    <template v-slot:append>
                                        <q-icon
                                            dense
                                            name="event"
                                            class="cursor-pointer"
                                            :disable="
                                                equipoStore.isLoading ||
                                                catalogoStore.isLoading ||
                                                isEdit
                                            "
                                        >
                                            <q-popup-proxy
                                                cover
                                                transition-show="scale"
                                                transition-hide="scale"
                                            >
                                                <q-date
                                                    v-model="fechanacimiento"
                                                    :options="DateRange"
                                                    :disable="
                                                        equipoStore.isLoading ||
                                                        catalogoStore.isLoading ||
                                                        isEdit
                                                    "
                                                >
                                                    <div
                                                        class="row items-center justify-end"
                                                    >
                                                        <q-btn
                                                            v-close-popup
                                                            label="Cerrar"
                                                            color="primary"
                                                            flat
                                                        />
                                                    </div>
                                                </q-date>
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-3">
                                <div class="text-caption">Sexo</div>
                                <q-select
                                    outlined
                                    v-model="sexoSelected"
                                    :options="catalogoStore.sexos"
                                    label="Sexo"
                                    :disable="
                                        equipoStore.isLoading ||
                                        catalogoStore.isLoading ||
                                        isEdit
                                    "
                                    dense
                                    class="col-4"
                                    hint="Seleccione un sexo."
                                    option-value="idsexo"
                                    option-label="sexo"
                                    :rules="[
                                        (select) =>
                                            !!select || 'Sexo es obligatorio.',
                                    ]"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-3">
                                <div class="text-caption">Es Portero</div>
                                <q-checkbox
                                    v-model="esPortero"
                                    label="Es Portero"
                                    :disable="
                                        equipoStore.isLoading ||
                                        catalogoStore.isLoading ||
                                        isEdit
                                    "
                                />
                            </div>
                        </div>
                    </q-form>
                </div>
            </q-card-section>
            <q-card-section align="right">
                <q-btn
                    color="primary"
                    icon="add"
                    round
                    :disabled="
                        equipoStore.isLoading ||
                        catalogoStore.isLoading ||
                        isEdit
                    "
                    @click="agregarJugadorAPlantilla"
                >
                    <q-tooltip> Agregar Jugador a Plantilla </q-tooltip>
                </q-btn>
            </q-card-section>
            <q-separator />
            <q-card-section class="row">
                <div class="col-3 text-weight-medium">Plantilla</div>
                <div class="col-9 q-gutter-md">
                    <q-table
                        grid
                        flat
                        bordered
                        card-class="bg-secondary"
                        title="Plantilla"
                        :rows="plantilla"
                        :columns="columns"
                        row-key="idjugador"
                        :filter="buscar"
                        hide-header
                        :rows-per-page-options="[0]"
                    >
                        <template v-slot:top-right>
                            <q-input
                                outlined
                                dense
                                debounce="300"
                                v-model="buscar"
                                placeholder="Buscar..."
                            >
                                <template v-slot:append>
                                    <q-icon name="search" />
                                </template>
                            </q-input>
                        </template>
                        <template v-slot:item="props">
                            <div
                                class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
                            >
                                <q-card bordered flat>
                                    <q-card-section>
                                        <div class="text-subtitle2">
                                            {{ props.row.nombres }}
                                            {{ props.row.paterno }}
                                            {{ props.row.materno }}
                                            <q-icon
                                                v-if="props.row.esportero"
                                                name="sports_mma"
                                                color="primary"
                                                size="2em"
                                            />
                                        </div>
                                    </q-card-section>
                                    <q-separator />
                                    <q-list dense>
                                        <q-item
                                            v-for="col in props.cols.filter((col:any) => col.name !== 'desc')"
                                            :key="col.name"
                                        >
                                            <q-item-section>
                                                <q-item-label>{{
                                                    col.label
                                                }}</q-item-label>
                                            </q-item-section>
                                            <q-item-section side>
                                                <q-item-label caption>{{
                                                    col.value
                                                }}</q-item-label>
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                    <q-separator class="q-mt-sm" />
                                    <q-card-actions align="right">
                                        <q-btn
                                            icon="visibility"
                                            color="primary"
                                            flat
                                            round
                                            @click="getJugador(props.row)"
                                        >
                                            <q-tooltip>
                                                Ver Jugador De La Plantilla
                                            </q-tooltip>
                                        </q-btn>
                                        <q-btn
                                            icon="delete"
                                            color="red"
                                            flat
                                            round
                                            @click="
                                                handleDeleteJugador(
                                                    props.row.idjugador
                                                )
                                            "
                                        >
                                            <q-tooltip>
                                                Eliminar Jugador De La Plantilla
                                            </q-tooltip>
                                        </q-btn>
                                    </q-card-actions>
                                </q-card>
                            </div>
                        </template>
                    </q-table>
                </div>
            </q-card-section>
            <q-separator class="q-my-md" />
        </q-form>
        <q-card-actions class="row justify-end">
            <q-btn
                flat
                label="Cancelar"
                :disabled="equipoStore.isLoading || catalogoStore.isLoading"
            />
            <q-btn
                color="primary"
                label="Guardar"
                :disabled="equipoStore.isLoading || catalogoStore.isLoading"
                @click="handleSave()"
            />
        </q-card-actions>
    </q-card>
    <FormSkeleton v-else />
    <ImagePreview v-model="openPreview" :image="previewImage" />
</template>
