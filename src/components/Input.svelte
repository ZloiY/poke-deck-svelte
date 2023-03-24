<script lang="ts">
  import { twMerge } from "tailwind-merge";

  import EyeOpen from "@icons/eye-open.svg?component";
  import EyeClose from "@icons/eye-close.svg?component";

  export let error = '';
  export let label = '';
  export let containerStyles = '';
  export let labelStyles = '';
  export let inputStyles = '';
  export let errorStyles = '';
  export let name = '';
  export let id = '';
  export let type: "text" | "password" | "email" = "text";
  export let value: string | number = "";
  let derivedType = type;
  $:showPassword = derivedType !== "password" ? true : false;
  const togglePassword = () => {
    if (type == 'password') {
      if (derivedType == 'password') {
        derivedType = 'text';
      } else {
        derivedType = 'password';
      }
    }
  };
</script>

<div class={twMerge("flex flex-col gap-1", containerStyles)}>
  {#if label}
    <label
      for={name}
      class={twMerge("text-lg font-medium", labelStyles)}
    >
      {label}
    </label>
  {/if}
  <div class="relative w-full">
    <input
      id={id}
      name={name}
      value={value}
      on:change
      type={derivedType}
      class={twMerge(
        `rounded-md border-2 border-white py-1 px-2 text-black outline-none text-lg w-full
         hover:shadow-zinc-300/50 focus:shadow-lg focus:shadow-yellow-300/50 focus:border-yellow-500
         transition-colors`,
        error && "border-red-500 bg-red-400 bg-opacity-50 text-white",
        inputStyles
      )}
    />
    {#if type == "password"}
      <div role="button" class={twMerge("absolute h-full w-1/12 top-0 right-0 pr-2 text-black transition-opacity duration-200",
        error && "text-white")}
        on:click={togglePassword}
      >
       <EyeOpen
         class={twMerge(
           "h-full w-full top-0 cursor-pointer ml-auto transition-opacity duration-200 opacity-0",
           showPassword && "opacity-100",
         )}
       /> 
       <EyeClose
         class={twMerge(
           "absolute py-2 pr-2 h-full w-full top-0 cursor-pointer ml-auto opacity-100 transition-opacity duration-200",
            showPassword && "opacity-0"
         )}
       /> 
      </div>
    {/if}
  </div>
  {#if error}
    <span class={twMerge("text-sm text-red-500", errorStyles)}>
     {error}
    </span>
  {/if}
</div>
