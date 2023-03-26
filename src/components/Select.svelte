<script lang="ts">
  import Select from "svelte-select";
  import Chevron from "@icons/arrow-left.svg?component";
  import Loader from "@icons/loader.svg?component";
  import { twMerge } from "tailwind-merge";
  
  type Item = { id: string, name: string };

  export let items: Item[] = [];
  export let className: string = "";
  export let placeholder: string = "Select item..."
  export let value: Item | null;
  export let name: string = "";

  const label = 'name';
  const itemId = 'id';
</script>

<div class={twMerge("w-full flex flex-col gap-2", className)}>
  {#if name.length > 0}
    <span class="font-coiny text-xl text-white">
      {name}
    </span>
  {/if}
  <Select {value} {label} {itemId} {placeholder} on:change {items} class="themed">
    <div class="h-8 w-8" slot="chevron-icon">
      <Chevron class="fill-purple-900 h-8 w-8"/>
    </div>
    <div slot="loading-icon" class="text-purple-900 h-8 w-8 animate-spin-slow">
      <Loader class="fill-purple-900 h-8 w-8"/>
    </div>
  </Select>
</div>

<style>
  .themed {
    --background: rgb(168 85 247);
    --border: rgb(88 28 135);
    --border-hover: rgb(234 179 8);
    --border-radius: 12px;
    --font-size: 24px;
    --item-color: rgb(88 28 135);
    --item-hover-bg: rgb(88 28 135);
    --item-hover-color: #000;
    --list-background: rgb(168 85 247);
    --list-border: 2px rgb(88 28 135);
    --list-border-radius: 12px;
    --input-color: rgb(88 28 135);
    --input-padding: 4px;
    --list-empty-color: #000;
  }
</style>
