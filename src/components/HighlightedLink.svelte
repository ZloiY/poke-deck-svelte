<script lang="ts">
  import { twMerge } from "tailwind-merge";
  export let href: string;

  const firstPart = typeof location !== undefined ? location.pathname.split("/")[1] : "";
  $:isHighLighted = `/${firstPart}` == href;
</script>
<a
  class={twMerge(
    "font-modak min-[580px]:text-8xl text-6xl lg:text-5xl hover:text-yellow-400 transition-colors",
    isHighLighted && "text-yellow-500",
  )}
  href={href}
>
  <slot/>
</a>

