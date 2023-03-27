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
  export let onChange: <T extends Item>(item: T) => void;

  const label = 'name';
  const itemId = 'id';
</script>

<div class={twMerge("w-full flex flex-col gap-2", className)}>
  {#if name.length > 0}
    <span class="font-coiny text-xl text-white">
      {name}
    </span>
  {/if}
  <Select {value} {label} {itemId} {placeholder} {items} 
    --background="rgb(168 85 247)"
    --border="2px solid rgb(88 28 135)"
    --border-hover="rgb(234 179 8)"
    --border-radius="12px"
    --font-size="24px"
    --list-background="transparent"
    --list-border="2px solid rgb(88 28 135)"
    >
    <div class="h-8 w-8" slot="chevron-icon">
      <Chevron class="fill-purple-900 h-8 w-8"/>
    </div>
    <div slot="list" class="bg-transparent" let:filteredItems>
     <div class="w-full h-full px-2 border-purple-900 bg-purple-500 rounded-b-xl border-t-0 max-h-20">
       {#each filteredItems as item}
         <div on:click={() => onChange(item)} class="w-full border-purple-900 bg-purple-500 text-purple-900 hover:text-white hover:bg-purple-900">
           <span class="text-xl">
             {item.name}
           </span>
         </div>
       {/each}
     </div>
    </div>
    <div slot="loading-icon" class="text-purple-900 h-8 w-8 animate-spin-slow">
      <Loader class="fill-purple-900 h-8 w-8"/>
    </div>
  </Select>
</div>

