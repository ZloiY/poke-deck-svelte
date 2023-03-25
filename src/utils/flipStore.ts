import { readonly, writable } from "svelte/store";

const flipStore = writable<FlipState>("Preview");

export const toggleFlip = () => {
  flipStore.update((state) => state == "Preview" ? "Details" : "Preview");
}

export const flipState = readonly(flipStore);
