<script lang="ts">
  import { twMerge } from "tailwind-merge";
  export let id = '';
  export let className = '';
  export let label = '';
  export let name = '';
</script>
<div class="flex items-center">
  <input
    id={id}
    name={name}
    type="checkbox"
    class={twMerge(
      "w-4 h-4 active:scale-90 cursor-pointer",
      className,
    )}
    on:change
  />
  <label for={id} class="ml-2 text-md font-medium">
    {label}
  </label>
</div>

