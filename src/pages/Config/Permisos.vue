<template>
    <div>
        <q-card>
            <q-card-section class="bg-primary text-white q-pa-sm">
                <div class="text-h6">Permisos</div>
            </q-card-section>
            <q-card-section>
                <q-breadcrumbs>
                    <q-breadcrumbs-el label="Permisos" icon="home" />
                </q-breadcrumbs>
            </q-card-section>
            <q-card class="q-ma-auto">
                <!-- Header -->
                <q-card-section>
                    <div class="text-h6">Asignar Permisos por Roles</div>
                    <div class="text-subtitle2">
                        Selecciona un rol y asigna los permisos adecuados.
                    </div>
                </q-card-section>

                <q-separator />

                <!-- Selección de Rol -->
                <q-card-section>
                    <div class="q-gutter-md row items-center">
                        <div class="col">
                            <q-select
                                outlined
                                v-model="personaSelected"
                                :options="configuracionStore.personas"
                                label="Personas"
                                :disable="
                                    configuracionStore.isLoading || isDisabled
                                "
                                dense
                                class="col-4"
                                hint="Seleccione una persona."
                                option-value="idusuario"
                                option-label="nombre"
                                :rules="[
                                    (select) =>
                                        !!select || 'Categoria es obligatorio.',
                                ]"
                                @update:model-value="
                                    async () => {
                                        await getPermisos();
                                    }
                                "
                            />
                        </div>
                        <div class="row items-center q-gutter-sm">
                            <div class="col-auto" v-if="isDisabled">
                                <q-btn
                                    flat
                                    round
                                    dense
                                    icon="edit"
                                    color="grey"
                                    @click="isDisabled = !isDisabled"
                                    class="q-mb-md"
                                ></q-btn>
                            </div>
                        </div>
                    </div>
                </q-card-section>

                <q-separator />

                <!-- Lista de Permisos -->
                <q-card-section v-if="!isDisabled">
                    <div class="q-mb-md">
                        <q-item-label class="q-mb-xs text-h6"
                            >Permisos</q-item-label
                        >
                        <div
                            v-for="(permiso, i) in configuracionStore.permisos"
                            :key="i"
                        >
                            <q-checkbox
                                v-model="permiso.tiene"
                                :label="permiso.permiso"
                            />
                        </div>
                    </div>
                </q-card-section>

                <q-separator />

                <!-- Botón Guardar -->
                <q-card-actions align="right">
                    <q-btn
                        label="Guardar"
                        color="primary"
                        @click="addPermisos()"
                        :disable="isDisabled"
                    ></q-btn>
                </q-card-actions>
            </q-card>
        </q-card>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useConfiguracionStore } from "@/store/configuracion";
import { showNotify } from "@/utils/utils";
import { PermisoInterface } from "@/utils/interfaces";

const configuracionStore = useConfiguracionStore();

const isDisabled = ref(true);
const personaSelected = ref(null);

const getPermisos = async () => {
    try {
        await configuracionStore.getPermisos(personaSelected.value.idusuario);
    } catch (e) {
        console.error(e.message);
    }
};

const addPermisos = async () => {
    try {
        configuracionStore.permisos.map(async (permiso: PermisoInterface) => {
            const formData = {
                idpermiso: permiso.idpermiso,
                idusuariopermiso: personaSelected.value.idusuario,
                tiene: permiso.tiene ? 1 : 0,
            };
            await configuracionStore.addPermisos(formData);
        });
    } catch (e) {
        console.error(e.message);
    } finally {
        if (!configuracionStore.error) {
            showNotify({
                msg: "Datos guardados.",
                color: "positive",
                icon: "success",
            });
        }
        isDisabled.value = true;
        personaSelected.value = null;
    }
};

onMounted(async () => {
    try {
        await configuracionStore.getPersonas();
    } catch (e) {
        console.error(e.message);
    }
});
</script>
