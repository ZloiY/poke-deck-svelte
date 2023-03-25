<script lang="ts">
  import { scale } from "svelte/transition";
  import { bounceIn } from "svelte/easing";
  import Close from "@icons/close.svg?component";
  import { twMerge } from "tailwind-merge";

  export let showModal = false;
  export let title = "";
  let dialog: HTMLDialogElement;

  $:if (dialog && showModal) dialog.showModal();
</script>

<dialog
  transition:scale={{ duration: 300, start: 1, opacity: 1, easing: bounceIn }}
  class={twMerge("backdrop:blur-sm",
  title && `bg-purple-900 text-white rounded-xl flex flex-col relative
  shadow-[0_0_20px_5px] shadow-purple-500 transition-opacity`,
  )}
  bind:this={dialog}
  on:close={() => (showModal = false)}
  on:click|self={() => dialog.close()}
  >
  <div class="flex justify-between mb-2 p-3 border-b-2 border-yellow-500">
    <span class="text-2xl font-coiny">{title}</span>
    <Close
      role="button"
      class="cursor-pointer w-8 h-8 hover:text-yellow-400"
      on:click={() => (showModal = false)}
    />
  </div>
   <slot/>
</dialog>

