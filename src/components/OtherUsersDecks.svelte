<script lang="ts">
  import InfiniteScroll from "svelte-infinite-scroll";
  import { trpcAstro } from "src/api";
  import { authHeader } from "src/utils/accessTokenStore";
  import { onMount } from "svelte";
  import DeckCard from "./Cards/Deck/DeckCard.svelte";
  import type { Deck } from "@prisma/client";
    import Spinner from "./Spinner.svelte";

  const trpcClient = trpcAstro($authHeader);
  let decks: Deck[] = [];
  let newDecks: Deck[] = [];
  let cursor: string | undefined = undefined;
  let decksLength = 0
  let isInitialLoading = false;
  
  const fetchDecks = async () => {
    const response = await trpcClient.deck.getOthersUsersDecks.query({ limit: 7, cursor })
    newDecks = response.decks;
    cursor = response.nextCursor;
    decksLength = response.decksLength;
  }

  onMount(() => {
    isInitialLoading = true;
    fetchDecks()
      .finally(() => {
        isInitialLoading = false;
      });
  });

  $:decks = [
    ...decks,
    ...newDecks
  ];

</script>
<div class="border-2 rounded-xl border-purple-900 bg-purple-800/60 p-2 pb-0 min-h-[570px]">
  <div class="flex justify-between items-center">
    <span class="font-coiny text-2xl">Others players decks:</span>
    <span class="font-coiny text-2xl">
      Total decks: {decksLength}
    </span>
  </div>
  {#if isInitialLoading}
    <Spinner className="w-40 h-40"/>
  {/if}
  <div class="w-full flex gap-5 overflow-x-scroll pb-4 scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-transparent">
    {#each decks as deck (deck.id)}
      <DeckCard {deck} onClick={() => { location.assign(`decks/${deck.id}`) }}/>        
    {/each}
    <InfiniteScroll
      hasMore={!!cursor}
      threshold={7}
      horizontal={true}
      on:loadMore={fetchDecks}
    />
  </div>
</div>

