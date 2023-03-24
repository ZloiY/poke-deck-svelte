<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import Loader from "@icons/loader.svg?component";

  export let className = '';
  export let isLoading = false;
  export let type: "submit" | "button" = "button"; 
</script>

<button
  type={type}
  on:click
  class={twMerge(
    `rounded-sm bg-blue-500 py-1 px-2 text-lg text-white cursor-pointer
     hover:shadow-[0_0_15px_4px] hover:shadow-zinc-400/50 hover:bg-yellow-500 active:bg-yellow-600
     disabled:bg-gray-500 disabled:hover:bg-gray-500 disabled:shadow-none disabled:cursor-auto
     disabled:text-gray-400
    `, 
    className,
  )}
>
  {#if isLoading}
    <div class="animate-spin-slow contrast-100 h-full w-full">
      <Loader />
    </div>
  {:else}
    <slot/>
  {/if}
</button>
