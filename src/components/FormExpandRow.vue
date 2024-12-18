<template>
    <div class="row">
        <div class="col-5" align="right">
            <span class="text-h3 text-weight-bold">{{ info.local }}</span>
            <div class="col-12" align="right">
                <span class="text-h4 text-weight-bold">
                    {{ info.goleslocal }}
                </span>
            </div>
            <div
                v-for="(gol, i) in info.golesLocal"
                :key="i"
                class="col-12"
                align="right"
            >
                <span class="text-h6">
                    {{ gol.nombre }}
                    {{ gol.goles }}
                    <q-icon name="sports_soccer"></q-icon>
                </span>
            </div>
            <div
                v-for="(expulsion, i) in info.expulsionesLocal"
                :key="i"
                class="col-12"
                align="right"
            >
                <span class="text-h6">
                    {{ expulsion.nombre }}
                    <q-icon name="crop_portrait" color="red"></q-icon>
                </span>
            </div>
        </div>
        <div class="col-1"></div>
        <div class="col-5" align="left">
            <span class="text-h3 text-weight-bold">{{ info.visitante }}</span>
            <div class="col-12" align="left">
                <span class="text-h4 text-weight-bold">
                    {{ info.golesvisitante }}
                </span>
            </div>
            <div
                v-for="(gol, i) in info.golesVisitante"
                :key="i"
                class="col-12"
                align="left"
            >
                <span class="text-h6">
                    <q-icon name="sports_soccer"></q-icon>
                    {{ gol.nombre }}
                    {{ gol.goles }}
                </span>
            </div>
            <div
                v-for="(expulsion, i) in info.expulsionesVisitante"
                :key="i"
                class="col-12"
                align="left"
            >
                <span class="text-h6">
                    <q-icon name="crop_portrait" color="red"></q-icon>
                    {{ expulsion.nombre }}
                </span>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
defineProps<{
    info?: any;
}>();
</script>
