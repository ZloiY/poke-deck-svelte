<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import LogoutIcon from "@icons/logout.svg?component";
  import BurgerMenu from "@icons/menu-burger.svg?component";
  import FlipButton from "./FlipButton.svelte";
    
  import HighlightedLink from "./HighlightedLink.svelte";
  import { authPayload, resetTokens } from "src/utils/accessTokenStore";

  export let showFlip = true;
  let showNavMenu = false;

  const toggleNavMenu = () => {
    showNavMenu = !showNavMenu;
  }
  
  const signOut = () => {
    resetTokens();
    location.assign("/home");
  };
</script>

<div
  class={twMerge(
    "w-full flex items-center justify-between bg-purple-900 py-5 mb-10 px-6 text-4xl",
    "shadow-lg shadow-purple-700/75 sticky top-0 z-50",
    showNavMenu && "relative",
  )}
>
  {#if $authPayload}
      <div
        role="button"
        class="text-white lg:hidden cursor-pointer
    hover:text-yellow-400 active:text-yellow-500 active:scale-90"
        on:click={() => toggleNavMenu()}
      >
        <BurgerMenu class="min-[580px]:w-20 min-[580px]:h-20 h-14 w-14" />
      </div>
      <div
        class={twMerge(
          "gap-10 items-center lg:flex hidden",
          showNavMenu &&
            "absolute top-0 left-0 h-[100vh] w-[100vw] flex flex-col justify-center bg-purple-900 z-[100]",
        )}
        on:click={() => toggleNavMenu()}
      >
        <HighlightedLink href="/home">Home</HighlightedLink>
        <HighlightedLink href="/decks">Decks</HighlightedLink>
        <HighlightedLink href="/pokemons">Pókemons</HighlightedLink>
      </div>
  {/if}
  {#if $authPayload}
    <div class="flex gap-4 items-center">
      {#if showFlip}
       <FlipButton/> 
      {/if}
      <span class="min-[580px]:text-6xl lg:text-4xl text-2xl">
        Hello, {$authPayload.name}!
      </span>
      <div
        role="button"
        on:click={signOut}
      >
        <LogoutIcon
          class="lg:w-8 lg:h-8 min-[580px]:w-14 min-[580px]:h-14 w-10 h-10 stroke-white hover:stroke-yellow-400 active:stroke-yellow-500 cursor-pointer"
        />
      </div>
    </div>
  {:else}
    <HighlightedLink href="/login">Sign In</HighlightedLink>
  {/if}
</div>

