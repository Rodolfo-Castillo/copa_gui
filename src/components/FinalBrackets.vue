<template>
    <div>
        <div id="bracketry-wrapper" name="bracketry-wrapper"></div>
        <FinalsDialog v-model:open="open" v-model:info="info" />
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { createBracket } from "bracketry";
import FinalsDialog from "@/components/FinalsDialog.vue";

const props = defineProps(["dataBracket"]);
const open = ref(false);
const info = ref(null);

const options = <any>{
    width: "100%",
    useClassicalLayout: true,
    onMatchClick: (match: any) => {
        info.value = match;
        open.value = true;
        console.log(open.value);
    },
};

const data = <any>{
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

onMounted(async () => {
    const wrapper = document.querySelector("#bracketry-wrapper");
    const bracket = createBracket(data, wrapper, options);
    bracket.replaceData(props.dataBracket);
});
</script>
