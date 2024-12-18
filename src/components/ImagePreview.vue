<template>
    <q-dialog v-model="openPreview" persistent>
        <q-card style="width: 100%">
            <q-bar class="bg-teal text-white">
                <div class="text-h6">Previo de Imágen</div>
                <q-space />
                <q-btn dense flat icon="close" v-close-popup>
                    <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
                </q-btn>
            </q-bar>
            <div>
                <q-img :style="imageStyle" :src="$props.image" />
            </div>
        </q-card>
    </q-dialog>
</template>
<script setup lang="ts">
const openPreview = <any>defineModel();
defineProps({
    image: String,
});

const imageStyle = {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
};
</script>
<style>
.previewImageCard {
    width: 100%;
    height: 100%;
}
</style>
