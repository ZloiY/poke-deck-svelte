<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import { Motion } from "svelte-motion";
  import Close from "@icons/close.svg?component";

  export let showModal = false;
  export let title = "";


  const closeDialog = () => {
     showModal = false;
  }
</script>
{#if showModal}
 <Motion let:motion
   initial={{ opacity: 0, scale: 0 }}
   animate={{ opacity: 1, scale: 1 }}
   exit={{ opacity: 0, scale: 0 }}
   transition={{ duration: 0.15, type: "spring", stiffness: 100 }}
 >
  <div use:motion class="backdrop-blur p-0 fixed inset-0 z-[100] flex justify-center items-center">
    <dialog
      class={twMerge("p-0 flex bg-transparent",
      title && `bg-purple-900 text-white rounded-xl flex flex-col
      shadow-[0_0_20px_5px] shadow-purple-500 transition-opacity`,
      )}
      >
      <div class="relative">
        {#if title}
          <div class="flex justify-between mb-2 p-3 border-b-2 border-yellow-500">
            <span class="text-2xl font-coiny">{title}</span>
            <div
              role="button"
              on:click={() => closeDialog()}
            >
              <Close
                class="cursor-pointer w-8 h-8 hover:text-yellow-400"
              />
            </div>
          </div>
        {/if}
         <slot closeDialog={closeDialog}/>
      </div>
    </dialog>
  </div>
 </Motion>
{/if}

