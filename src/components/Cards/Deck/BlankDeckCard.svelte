<script lang="ts">
   import { twMerge } from "tailwind-merge";
   import BlankCard from "../BlankCard.svelte";

   export let notInteractive = false;
   export let className = '';
</script>

<BlankCard
  className={twMerge(
    `transition-all border-2 border-transparent cursor-pointer text-white hover:text-yellow-500
hover:shadow-none hover:border-yellow-500 w-80
active:scale-90 active:border-transparent active:shadow-[0_0_30px_10px] active:shadow-yellow-500`,
    notInteractive && "pointer-events-none select-none",
    className,
  )}
 on:click 
>
  <slot/>
</BlankCard>

