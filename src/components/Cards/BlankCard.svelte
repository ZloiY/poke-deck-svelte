<script lang="ts">
  import Loader from "@icons/loader.svg?component";
  import { twMerge } from "tailwind-merge";

  export let isLoading = false;
  export let className = '';
  export let notInteractive = false;
</script>
<div
  role="button"
  class={twMerge(
    `
  flex items-center justify-center
  relative
  rounded-xl
  bg-purple-900
  h-[500px] w-[300px] max-w-xs
  p-4
  text-white
  hover:shadow-[0_0_15px_4px] hover:shadow-orange-500`,
    notInteractive && "pointer-events-none select-none",
    className,
  )}
  on:click
>
  {#if isLoading}
    <div class="animate-spin-slow h-15 w-15">
      <Loader/>
    </div>
  {:else}
    <slot/>
  {/if}
</div>

