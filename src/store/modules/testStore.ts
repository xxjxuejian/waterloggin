import { defineStore } from "pinia";
import { pinia } from "@/store";

export const useTestStore = defineStore("test", () => {
  const count = ref(0);

  const doubleCount = computed(() => count.value * 2);
  function increment() {
    count.value++;
  }

  return { count, doubleCount, increment };
});

export function useTestStoreHook() {
  return useTestStore(pinia);
}
