// Utilities
import { defineStore } from "pinia";
// import { HttpPost, HttpPut } from "@/utils/http";

export const useCopaStore = defineStore("copa", {
    state: () => ({
        isLoading: false,
        msg: "",
        error: false,
    }),
});