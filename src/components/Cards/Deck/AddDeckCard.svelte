<script lang="ts">
  import Add from "@icons/add-inverse.svg?component";
  import BlankDeckCard from "./BlankDeckCard.svelte";

  export let onClick: () => void;
</script>
<BlankDeckCard on:click={onClick}>
  <div class="flex justify-center items-center w-full h-full">
    <div role="button">
      <Add class="w-64 h-60" />
      <p class="font-coiny mt-4 text-2xl text-center">Create new deck</p>
    </div>
  </div>
</BlankDeckCard>

