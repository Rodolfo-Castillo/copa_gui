<template>
    <div>
        <q-card>
            <q-card-section class="bg-primary text-white q-pa-sm">
                <div class="text-h6">Resultados</div>
            </q-card-section>
            <q-card-section>
                <q-breadcrumbs>
                    <q-breadcrumbs-el
                        label="Resultados"
                        icon="home"
                        to="/resultados"
                    />
                    <q-breadcrumbs-el label="Resultado" icon="task_alt" />
                </q-breadcrumbs>
            </q-card-section>
            <q-card-section class="row">
                <div class="col-3 text-weight-medium">Resultado Final</div>
                <div class="col-9 q-gutter-md">
                    <h6>Sección 1 - Goles en el partido</h6>
                    <div class="row">
                        <div class="col-3">
                            <div class="text-caption">
                                {{ resultadosStore.partido.local }}
                            </div>
                            <q-input
                                outlined
                                v-model="golesLocal"
                                label="Goles"
                                dense
                                mask="###"
                                :disabled="resultadosStore.isLoading"
                                :hint="`Goles del equipo ${resultadosStore.partido.local} es obligatorio.`"
                                :rules="[
                                    (val) =>
                                        !!val ||
                                        'Goles del equipo ' +
                                            resultadosStore.partido.local +
                                            ' es obligatorio.',
                                ]"
                            />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-3">
                            <div class="text-caption">
                                {{ resultadosStore.partido.visitante }}
                            </div>
                            <q-input
                                outlined
                                v-model="golesVisitante"
                                label="Goles"
                                dense
                                mask="###"
                                :disabled="resultadosStore.isLoading"
                                :hint="`Goles del equipo ${resultadosStore.partido.visitante} es obligatorio.`"
                                :rules="[
                                    (val) =>
                                        !!val ||
                                        'Goles del equipo ' +
                                            resultadosStore.partido.visitante +
                                            ' es obligatorio.',
                                ]"
                            />
                        </div>
                    </div>
                </div>
            </q-card-section>
            <q-separator></q-separator>
            <q-card-section class="row">
                <div class="col-3 text-weight-medium">
                    Eventos en el partido
                </div>
                <div class="col-9 q-gutter-md">
                    <h6>Sección 2 - Goles</h6>
                    <div class="row">
                        <div class="col-12">
                            <div class="text-caption">
                                Goles del equipo
                                {{ resultadosStore.partido.local }}
                            </div>
                            <q-table
                                style="height: 400px"
                                flat
                                bordered
                                title="Jugadores"
                                :rows="resultadosStore.jugadoresLocal"
                                :columns="columns"
                                row-key="idjugador"
                                virtual-scroll
                                hide-pagination
                                :rows-per-page-options="[0]"
                            >
                                <template v-slot:body-cell-foto="props">
                                    <q-td :props="props">
                                        <q-img
                                            :src="props.row.foto"
                                            spinner-color="white"
                                            style="
                                                height: 75px;
                                                max-width: 80px;
                                            "
                                        />
                                    </q-td>
                                </template>
                                <template
                                    v-slot:body-cell-nombrecompleto="props"
                                >
                                    <q-td :props="props">
                                        {{ props.row.nombrecompleto }}
                                    </q-td>
                                </template>
                                <template v-slot:body-cell-goles="props">
                                    <q-td
                                        :props="props"
                                        style="cursor: pointer"
                                    >
                                        {{ props.row.goles }}
                                        <q-popup-edit
                                            v-model="props.row.goles"
                                            title="Escriba los goles anotados en el partido"
                                            buttons
                                            v-slot="scope"
                                        >
                                            <q-input
                                                v-model="scope.value"
                                                dense
                                                autofocus
                                                counter
                                                mask="###"
                                                @keyup.enter="scope.set"
                                            />
                                        </q-popup-edit>
                                    </q-td>
                                </template>
                                <template v-slot:body-cell-expulsado="props">
                                    <q-td key="expulsado" :props="props">
                                        <q-checkbox
                                            v-model="props.row.expulsado"
                                        />
                                    </q-td>
                                </template>
                            </q-table>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <div class="text-caption">
                                Goles del equipo
                                {{ resultadosStore.partido.visitante }}
                            </div>
                            <q-table
                                style="height: 400px"
                                flat
                                bordered
                                title="Jugadores"
                                :rows="resultadosStore.jugadoresVisitante"
                                :columns="columns"
                                row-key="idjugador"
                                virtual-scroll
                                hide-pagination
                                :rows-per-page-options="[0]"
                            >
                                <template v-slot:body-cell-foto="props">
                                    <q-td :props="props">
                                        <q-img
                                            :src="props.row.foto"
                                            spinner-color="white"
                                            style="
                                                height: 75px;
                                                max-width: 80px;
                                            "
                                        />
                                    </q-td>
                                </template>
                                <template
                                    v-slot:body-cell-nombrecompleto="props"
                                >
                                    <q-td :props="props">
                                        {{ props.row.nombrecompleto }}
                                    </q-td>
                                </template>
                                <template v-slot:body-cell-goles="props">
                                    <q-td
                                        :props="props"
                                        style="cursor: pointer"
                                    >
                                        {{ props.row.goles }}
                                        <q-popup-edit
                                            v-model="props.row.goles"
                                            title="Escriba los goles anotados en el partido"
                                            buttons
                                            v-slot="scope"
                                        >
                                            <q-input
                                                v-model="scope.value"
                                                dense
                                                autofocus
                                                counter
                                                mask="###"
                                                @keyup.enter="scope.set"
                                            />
                                        </q-popup-edit>
                                    </q-td>
                                </template>
                                <template v-slot:body-cell-expulsado="props">
                                    <q-td key="expulsado" :props="props">
                                        <q-checkbox
                                            v-model="props.row.expulsado"
                                        />
                                    </q-td>
                                </template>
                            </q-table>
                        </div>
                    </div>
                </div>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn
                    flat
                    label="Cancelar"
                    :disabled="resultadosStore.isLoading"
                    @click="router.push('/resultadosStore')"
                />
                <q-btn
                    color="primary"
                    label="Guardar"
                    :disabled="resultadosStore.isLoading"
                    @click="handleSave()"
                />
            </q-card-actions>
        </q-card>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useResultadosStore } from "@/store/resultados";
import { useRoute, useRouter } from "vue-router";
import { showNotify } from "@/utils/utils";

const route = useRoute();
const router = useRouter();
const resultadosStore = useResultadosStore();

const golesLocal = ref(0);
const golesVisitante = ref(0);
const columns = <any>[
    {
        name: "foto",
        required: true,
        field: "foto",
        label: "Foto",
        align: "left",
        style: "width: 20%;",
    },
    {
        name: "nombrecompleto",
        align: "center",
        label: "Nombre Completo",
        field: "nombrecompleto",
        style: "width: 35%;",
    },
    {
        name: "goles",
        label: "Goles",
        field: "goles",
        style: "width: 15%;",
    },
    {
        name: "expulsado",
        label: "Expulsado",
        field: "expulsado",
        style: "width: 15%;",
    },
];

const handleSave = async () => {
    try {
        const golLocal = resultadosStore.jugadoresLocal.filter(
            (jugador: any) => jugador.goles > 0
        );
        const expulsionesLocal = resultadosStore.jugadoresLocal.filter(
            (jugador: any) => jugador.expulsado == true
        );

        const golVisitante = resultadosStore.jugadoresVisitante.filter(
            (jugador: any) => jugador.goles > 0
        );
        const expulsionesVisitante = resultadosStore.jugadoresVisitante.filter(
            (jugador: any) => jugador.expulsado == true
        );

        await resultadosStore.addResultadoFinal({
            idpartido: +route.params.id,
            goleslocal: golesLocal.value,
            golesvisitante: golesVisitante.value,
        });

        golLocal.map(async (jugador: any) => {
            try {
                await resultadosStore.setGolesJugador(
                    jugador.idjugador,
                    jugador.goles,
                    +route.params.id
                );
            } catch (e: any) {
                console.error(e);
            }
        });

        expulsionesLocal.map(async (jugador: any) => {
            try {
                await resultadosStore.setExpulsionJugador(
                    jugador.idjugador,
                    +route.params.id
                );
            } catch (e: any) {
                console.error(e);
            }
        });

        golVisitante.map(async (jugador: any) => {
            try {
                await resultadosStore.setGolesJugador(
                    jugador.idjugador,
                    jugador.goles,
                    +route.params.id
                );
            } catch (e: any) {
                console.error(e);
            }
        });

        expulsionesVisitante.map(async (jugador: any) => {
            try {
                await resultadosStore.setExpulsionJugador(
                    jugador.idjugador,
                    +route.params.id
                );
            } catch (e: any) {
                console.error(e);
            }
        });
        router.push("/resultados");
        showNotify({
            msg: "Datos guardados.",
            color: "positive",
            icon: "success",
        });
    } catch (e: any) {
        console.error(e);
    }
};

onMounted(async () => {
    try {
        await resultadosStore.getPartidoInfo(+route.params.id);
    } catch (e: any) {
        console.error(e);
    }
});
</script>
