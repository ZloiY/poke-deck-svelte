<script lang="ts">
  import type { Pokemon } from "pokenode-ts";
  import type { Deck, Pokemon as PokemonDB } from "@prisma/client";
  import { pagination as paginationStore} from "src/utils/pagination";
  import { selectedPokemons } from "src/utils/selectedPokemonsStore";
  import FlipCard from "./Cards/FlipCard.svelte";
  import PaginationButtons from "./PaginationButtons.svelte";
  import CardsGrid from "./CardsGrid.svelte";
  import FixedButton from "./FixedButton.svelte";
  import SearchBar from "./SearchBar.svelte";
  import Spinner from "./Spinner.svelte";
  import { authPayload } from "src/utils/accessTokenStore";
  import { trpcAstro } from "src/api";
  import { flipState } from "src/utils/flipStore";

  export let deckId = '';
  export let search = '';
  export let page = 0;

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
  let pokemonsInDeckPromise = new Promise<PokemonDB[]>(resolve => resolve([]))
  let emptyDeckPromise = new Promise<Deck[]>(resolve => resolve([]));
  const promisePokemons = trpcAstro.pokemon
  .getPokemonList.query({ offset: page * 15, limit: 15, searchQuery: search })
  $: if ($authPayload) {
    pokemonsInDeckPromise = trpcAstro.pokemon.getPokemonsByDeckId.query(deckId);
    emptyDeckPromise = trpcAstro.deck.getEmptyUserDecks.query({ numberOfEmptySlots: 20 });
  }

  const updateQuery = (search: string) => {
    if (search.length > 0) {
      location.assign(`/home?search=${search}`);
    }
  }

</script>
<div class="flex flex-col h-full w-full">
  <!--{(deckId || decksLength > 0) && (
    <AddCards deckId={deckId} onSubmit={refetch} />
  )}
  {decksLength == 0 && !deckId && (
    <CreateDeck create={createDeckWithCards} isLoading={deckCreating} />
  )}-->
  {#await pokemonsInDeckPromise then pokemonsInDeck }
    <FixedButton
    on:click={() => {}}
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

