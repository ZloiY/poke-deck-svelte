<script lang="ts">
  import type { Pokemon } from "pokenode-ts";
  import { onMount } from "svelte";
  import type { Deck, Pokemon as PokemonDB } from "@prisma/client";
  import { pagination as paginationStore} from "src/utils/pagination";
  import { selectedPokemons } from "src/utils/selectedPokemonsStore";
  import FlipCard from "./Cards/FlipCard.svelte";
  import PaginationButtons from "./PaginationButtons.svelte";
  import CardsGrid from "./CardsGrid.svelte";
  import FixedButton from "./FixedButton.svelte";
  import SearchBar from "./SearchBar.svelte";
  import Spinner from "./Spinner.svelte";
  import { authHeader, authPayload } from "src/utils/accessTokenStore";
  import { trpcAstro } from "src/api";
  import { flipState } from "src/utils/flipStore";
  import CreateDeck from "./Modals/CreateDeck.svelte";
  import AddCards from "./Modals/AddCards.svelte";

  export let deckId = '';
  export let search = '';
  export let page = 0;

  let showModal = false;

  const { paginationState, ...pagination } = paginationStore({
    page,
    limit: 15,
    totalLength: 1275,
    onNextPage: (nextPage) => {
      location.assign(`/home/${nextPage}`);
    },
    onPrevPage: (prevPage) => {
      location.assign(`/home/${prevPage}`);
    }
  })
  let pokemonsInDeckPromise = Promise.resolve([] as PokemonDB[]);
  let emptyDeckPromise = Promise.resolve([] as Deck[]);
  let promisePokemons = Promise.resolve([] as Pokemon[]) 
  const trpcClient = trpcAstro($authHeader);

  onMount(() => {
    promisePokemons = trpcClient.pokemon
      .getPokemonList.query({ offset: page * 15, limit: 15, searchQuery: search })
  });

  $: if ($authPayload) {
    pokemonsInDeckPromise = trpcClient.pokemon.getPokemonsByDeckId.query(deckId);
    emptyDeckPromise = trpcClient.deck.getEmptyUserDecks.query({ numberOfEmptySlots: 20 });
  }

  const refetch = () => {
    promisePokemons = trpcClient.pokemon
     .getPokemonList.query({ offset: page * 15, limit: 15, searchQuery: search })
  }

  const updateQuery = (search: string) => {
    if (search.length > 0) {
      location.assign(`/home?search=${search}`);
    }
  }

</script>
<div class="flex flex-col h-full w-full">
  {#await emptyDeckPromise then emptyDecks}
    {#if deckId || emptyDecks.length > 0}
      <AddCards bind:showModal deckId={deckId} onSubmit={refetch} />
    {/if}
    {#if emptyDecks.length == 0 && !deckId}
      <CreateDeck bind:showModal cards={$selectedPokemons} />
    {/if}
  {/await}
  {#await pokemonsInDeckPromise then pokemonsInDeck }
    <FixedButton
      on:click={() => (showModal = true)}
      existingPokemonsLength={pokemonsInDeck?.length ?? 0}
     />
  {/await}
  <PaginationButtons
    showNext={pagination.hasNextPage}
    showPrev={pagination.hasPrevPage}
    onNextPage={pagination.goToNextPage}
    onPrevPage={pagination.goToPrevPage}
  />
  <div class="flex relative justify-center items-center">
    <SearchBar searchValue={search} onChange={updateQuery} />
  </div>
  {#await Promise.all([promisePokemons, pokemonsInDeckPromise])}
    <Spinner/>    
  {:then [ pokemons, pokemonsInDeck ]} 
    <CardsGrid
      paginationState={$paginationState}
      pokemons={pokemons}
      let:pokemon={pokemon}
    >
     <FlipCard
       pokemon={pokemon}
       selectedPokemons={$selectedPokemons}
       pokemonsInDeck={pokemonsInDeck}
       keepFlipped={$flipState}
     />
    </CardsGrid>
  {/await}
</div>

