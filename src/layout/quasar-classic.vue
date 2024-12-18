<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated class="bg-cyan-8">
            <q-toolbar>
                <q-btn flat @click="toggleDrawer" round dense icon="menu" />
                <q-toolbar-title>Copa</q-toolbar-title>
                <q-btn dense flat label="Salir" @click="logOut" />
                <div style="width: 15px"></div>
            </q-toolbar>
        </q-header>

        <q-drawer v-model="drawer" show-if-above :width="200" :breakpoint="400">
            <q-scroll-area
                style="
                    height: calc(100% - 150px);
                    margin-top: 150px;
                    border-right: 1px solid #ddd;
                "
            >
                <q-list padding>
                    <q-item clickable v-ripple to="/">
                        <q-item-section avatar>
                            <q-icon name="style" />
                        </q-item-section>

                        <q-item-section> Equipos </q-item-section>
                    </q-item>

                    <q-item clickable v-ripple to="/grupos">
                        <q-item-section avatar>
                            <q-icon name="groups_2" />
                        </q-item-section>

                        <q-item-section> Grupos </q-item-section>
                    </q-item>

                    <q-expansion-item
                        expand-separator
                        icon="fa-solid fa-list-ol"
                        label="Partidos"
                    >
                        <q-item clickable v-ripple to="/partidos">
                            <q-item-section> Fase de grupos </q-item-section>
                        </q-item>
                        <q-item clickable v-ripple to="/partidosfinales">
                            <q-item-section> Fase final </q-item-section>
                        </q-item>
                    </q-expansion-item>

                    <q-item clickable v-ripple to="/resultados">
                        <q-item-section avatar>
                            <q-icon name="checklist" />
                        </q-item-section>

                        <q-item-section> Resultados Grupos</q-item-section>
                    </q-item>

                    <q-item clickable v-ripple to="/finales">
                        <q-item-section avatar>
                            <q-icon name="emoji_events" />
                        </q-item-section>

                        <q-item-section> Finales </q-item-section>
                    </q-item>

                    <q-item clickable v-ripple to="/expulsiones">
                        <q-item-section avatar>
                            <q-icon name="crop_portrait" />
                        </q-item-section>

                        <q-item-section> Expulsiones </q-item-section>
                    </q-item>

                    <q-expansion-item
                        expand-separator
                        icon="analytics"
                        label="Estadisticas"
                    >
                        <q-item clickable v-ripple to="/estadisticas/grupo">
                            <q-item-section> Grupos </q-item-section>
                        </q-item>
                        <q-item clickable v-ripple to="/estadisticas/jugador">
                            <q-item-section> Jugador </q-item-section>
                        </q-item>
                    </q-expansion-item>

                    <q-item clickable v-ripple to="/bitacora">
                        <q-item-section avatar>
                            <q-icon name="content_paste" />
                        </q-item-section>

                        <q-item-section> Bitácora </q-item-section>
                    </q-item>
                </q-list>
            </q-scroll-area>

            <q-img
                class="absolute-top"
                src="https://cdn.quasar.dev/img/material.png"
                style="height: 150px"
            >
                <div
                    class="absolute-bottom bg-transparent q-pa-md q-flex flex-center column"
                >
                    <!-- <q-avatar size="65px" class="q-mb-sm">
                        <img src="/images/logo.jpg" />
                    </q-avatar>
                    <div class="text-weight-bold text-center">
                        Confia Health
                    </div>-->
                    <div class="text-center">Copa</div>
                </div>
            </q-img>
        </q-drawer>

        <q-page-container>
            <q-page padding>
                <router-view :key="router.fullPath" />
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useAuthStore } from "@/store/auth";

const router = <any>useRouter();
const drawer = ref(true);
const authStore = useAuthStore();

const toggleDrawer = () => {
    drawer.value = !drawer.value;
};

const logOut = async () => {
    try {
        await authStore.logout();
    } catch (e) {
        console.error(e.message);
    }
};
</script>
