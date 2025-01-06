<template>
    <div>
        <q-card>
            <q-card-section class="bg-primary text-white q-pa-sm">
                <div class="text-h6">Copa</div>
            </q-card-section>
            <q-card-section>
                <q-breadcrumbs v-if="!catalogoStore.isLoading">
                    <q-breadcrumbs-el label="Copa" icon="home" />
                </q-breadcrumbs>
            </q-card-section>
            <q-card-section class="row">
                <div class="col-3 text-weight-medium">Copa</div>
                <div class="col-9 q-gutter-md">
                    <h6>Sección 1 - AGREGAR COPA</h6>
                    <div class="row">
                        <div class="col-3">
                            <div class="text-caption">Copa</div>
                            <q-input
                                outlined
                                v-model="copa"
                                label="Copa"
                                dense
                                :disabled="catalogoStore.isLoading"
                                hint="Copa es obligatorio."
                                :rules="[
                                    (val) => !!val || 'Copa es obligatorio.',
                                ]"
                            />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-3">
                            <div class="text-caption">Activo</div>
                            <q-checkbox
                                v-model="activo"
                                label="Activo"
                                :disable="catalogoStore.isLoading || !isEdit"
                            />
                        </div>
                    </div>
                </div>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn
                    color="primary"
                    label="Guardar"
                    :disabled="catalogoStore.isLoading"
                    @click="handleSave()"
                />
            </q-card-actions>
            <q-card-section class="row">
                <div class="col-12">
                    <q-table
                        title="Copas"
                        :rows="catalogoStore.copas"
                        :columns="columns"
                        row-key="idcopa"
                        style="height: 310px"
                        hide-bottom
                        :rows-per-page-options="[0]"
                    >
                        <template v-slot:body-cell-activo="props">
                            <q-td :props="props">
                                <q-icon
                                    v-if="props.row.activo"
                                    name="check_circle"
                                    color="green"
                                />
                            </q-td>
                        </template>
                        <template v-slot:body-cell-action="props">
                            <q-td :props="props">
                                <q-btn
                                    flat
                                    round
                                    dense
                                    icon="edit"
                                    color="grey"
                                    @click="getCopa(props.row.idcopa)"
                                >
                                    <q-tooltip>Editar Copa</q-tooltip>
                                </q-btn>

                                <q-btn
                                    flat
                                    round
                                    dense
                                    icon="delete"
                                    color="red"
                                    @click="delCopa(props.row.idcopa)"
                                >
                                    <q-tooltip>Eliminar Copa</q-tooltip>
                                </q-btn>
                            </q-td>
                        </template>
                    </q-table>
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useCatalogoStore } from "@/store/catalogo";
import { showNotify } from "@/utils/utils";
import { CopaInterface } from "@/utils/interfaces";

const catalogoStore = useCatalogoStore();

const copaId = ref(0);
const copa = ref(null);
const activo = ref(true);
const isEdit = ref(false);
const columns = <any>[
    {
        name: "copa",
        required: true,
        label: "Copa",
        field: "copa",
        align: "center",
        sortable: true,
        style: "width:70%",
    },
    {
        name: "activo",
        align: "center",
        label: "Activo",
        field: "activo",
        sortable: false,
        style: "width:20%",
    },
    {
        name: "action",
        align: "center",
        label: "",
        field: "",
        sortable: false,
        style: "width:10%",
    },
];

const handleSave = async () => {
    try {
        const formData = {
            copa: copa.value,
            activo: activo.value ? 1 : 0,
        };
        if (isEdit.value) {
            await catalogoStore.updCopa(copaId.value, formData);
        } else {
            await catalogoStore.addCopa(formData);
        }
        if (!catalogoStore.error) {
            showNotify({
                msg: "Datos guardados.",
                color: "positive",
                icon: "success",
            });
        }
    } catch (e: any) {
        console.error(e.message);
    }
};

const getCopa = (idCopa: number) => {
    const copaSelected = catalogoStore.copas.filter(
        (copa: CopaInterface) => copa.idcopa == idCopa
    )[0];
    copaId.value = copaSelected.idcopa;
    copa.value = copaSelected.copa;
    activo.value = copaSelected.activo;
    isEdit.value = true;
};

const delCopa = async (idCopa: number) => {
    try {
        await catalogoStore.delCopa(idCopa);
        if (!catalogoStore.error) {
            showNotify({
                msg: "Datos guardados.",
                color: "positive",
                icon: "success",
            });
        }
    } catch (e: any) {
        console.error(e);
    }
};

onMounted(async () => {
    try {
        await catalogoStore.listCopas();
    } catch (e: any) {
        console.error(e);
    }
});
</script>
