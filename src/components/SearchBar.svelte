<script lang="ts">
  export let searchValue = "";
  export let placeholder = "Enter pokemon name...";
  export let onChange: (value: string) => void;

  let search = searchValue;
  let timeoutId: number;

  const updateSearchValue = (e: Event) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    console.log('Search event', e);
    timeoutId = setTimeout(() => {
      onChange("test");
    }, 150);
  }
</script>

<input
  class="w-4/5 h-full
  p-2
  text-3xl 
  border-4 rounded
  border-white hover:border-yellow-500 focus:border-purple-900
  bg-transparent outline-none
  placeholder:italic placeholder:font-light placeholder:text-purple-900/75 placeholder:text-2xl"
  value={search}
  placeholder={placeholder}
  on:change={updateSearchValue}
/>

