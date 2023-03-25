<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { twMerge } from "tailwind-merge";
  import Close from "@icons/close.svg?component";
  import { removeMessage } from "src/utils/notificationStore";

  export let message: Message;
  onMount(() => {
    const timeoutId = setTimeout(() => {
      removeMessage(message);
      clearTimeout(timeoutId);
    }, 6000)
  });
</script>

<div transition:fade={{ duration: 300 }} class={twMerge("w-80 rounded-3xl text-white p-4 z-[60] backdrop-blur-md",
  message.state == "Success"
  ? "bg-lime-400/70 shadow-[0px_0px_15px_4px] shadow-lime-500"
  : "bg-red-600/70 shadow-[0px_0px_15px_4px] shadow-red-700")}>
  <div class="flex justify-between items-center w-full">
    <span class="text-2xl font-coiny">{message.state}!</span>
    <Close
      on:click={() => removeMessage(message)}
      class="w-8 h-8 cursor-pointer active:scale-90"
    />
  </div>
  <p class="mt-5 text-center text-xl">{message.message}</p>
</div>
