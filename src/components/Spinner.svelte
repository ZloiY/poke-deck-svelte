<script lang="ts">
  import { twMerge } from "tailwind-merge";

  import LoaderIcon from "@icons/loader.svg?component";

  export let className = '';
</script>

<div class="flex items-center justify-center h-full">
  <div
    class={twMerge(
      "h-15 w-15 animate animate-spin-slow text-purple-900",
      className,
    )}
  >
    <LoaderIcon />
  </div>
</div>

