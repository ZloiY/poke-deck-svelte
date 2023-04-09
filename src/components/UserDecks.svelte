<script lang="ts">
  import InfiniteScroll from "svelte-infinite-scroll";
  import type { Deck } from "@prisma/client";
  import { trpcAstro } from "src/api";
  import { authHeader } from "src/utils/accessTokenStore";
  import { pushNewMessage } from "src/utils/notificationStore";
  import { onMount } from "svelte";
  import DeckCard from "./Cards/Deck/DeckCard.svelte";
  import AddDeckCard from "./Cards/Deck/AddDeckCard.svelte";
  import CreateDeck from "./Modals/CreateDeck.svelte";
  import Spinner from "./Spinner.svelte";

  const trpcClient = trpcAstro($authHeader);
  let isFetching = false;
  let isInitialLoading = false;
  let decks: Deck[] = [];
  let numberOfFetches = 0;
  let newDecks: Deck[] = [];
  let cursor: string | undefined = undefined;
  let showCreateDeckModal = false;

  const addPokemons = (deckId: string) => {
    location.assign(`/home?deckId=${deckId}`);
  }

  const fetchUserDecks = async () => {
    const response = await trpcClient.deck.getUserDecks.query({ limit: 4, cursor });
    newDecks = response.decks;
    numberOfFetches += 1;
    cursor = response.nextCursor;
  }

  const removeDeck = async (deckId: string) => {
    isFetching = true;
    const message = await trpcClient.deck.removeUserDeck.mutate(deckId);
    pushNewMessage(message);
    if (message.state == 'Success') {
      const response = await trpcClient.deck.getUserDecks.query({ limit: 4 * numberOfFetches }); 
      decks = response.decks;
      newDecks = [];
    }
    isFetching = false;
  }

  const deckCreated = async (deckId?: string) => {
    if (deckId) {
      isFetching = true;
      const response = await trpcClient.deck.getUserDecks.query({ limit: 4 * numberOfFetches }); 
      decks = response.decks;
      newDecks = [];
      isFetching = false;
    }
  }

  onMount(() => {
    isInitialLoading = true;
    fetchUserDecks()
     .finally(() => {
        isInitialLoading = false;
     });
  })

  $:decks = [
    ...decks,
    ...newDecks,
  ]
</script>

<CreateDeck showModal={showCreateDeckModal} onComplete={deckCreated} />
<div class="border-2 rounded-xl border-purple-900 bg-purple-800/60 p-2 pb-0 relative w-full">
  {#if isFetching}
    <div class="backdrop-blur-md flex justify-center items-center absolute top-0 left-0 w-full h-full z-50">
      <Spinner className="w-60 h-60 text-orange-500" />
    </div>
  {/if}
  <div class="flex justify-between items-center">
    <span class="font-coiny text-3xl">Your Decks:</span>
    <span class="font-coiny text-3xl font-normal">
      {decks?.length}/{import.meta.env.PUBLIC_USER_MAX_DECKS}
    </span>
  </div>
  <div
    class="w-full flex gap-5 overflow-x-scroll overflow-y-hidden pb-4 scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-transparent"
  >
    {#if decks.length != +import.meta.env.PUBLIC_USER_MAX_DECKS}
      <AddDeckCard onClick={() => (showCreateDeckModal = true)} />
    {/if}
    {#if isInitialLoading}
      <div class="flex justify-center items-center flex-grow-[2]"> 
        <Spinner className="w-60 h-60"/> 
      </div>
    {/if}
    {#each decks as deck (deck.id)}
      <DeckCard
        deck={deck}
        onClick={() => location.assign(`/pokemons/${deck.id}`)}
        addCard={addPokemons}
        removeDeck={removeDeck}
      />
    {/each}
    <InfiniteScroll
      hasMore={!!cursor}
      horizontal={true}
      threshold={7}
      on:loadMore={() => fetchUserDecks()}
    />
  </div>
</div>

