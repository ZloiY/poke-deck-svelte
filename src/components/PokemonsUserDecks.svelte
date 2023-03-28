<script lang="ts">
  import { onMount } from "svelte";
  import { Motion } from "svelte-motion";
  import { twMerge } from "tailwind-merge";
  import type { Deck } from "@prisma/client";
  import { trpcAstro } from "src/api";
  import { authHeader } from "src/utils/accessTokenStore";
  import { cardsGridStyle } from "src/utils/styles";
  import { pushNewMessage } from "src/utils/notificationStore";
  import AddDeckCard from "./Cards/Deck/AddDeckCard.svelte";
  import CreateDeck from "./Modals/CreateDeck.svelte";
  import DeckCard from "./Cards/Deck/DeckCard.svelte";
  import Spinner from "./Spinner.svelte";

  const animationVariants = {
    entrance: { opacity: 1, scale: 1 },
    rotate: { rotateY: 0, perspective: 300 },
  };
  const trpcClient = trpcAstro($authHeader);
  let isFetching = false;
  let decks: Deck[] = [];
  let showModal = false;

  const fetchDecks = async () => {
    isFetching = true;
    const userDecks = await trpcClient.deck.getUserDecks.query({ limit: null })
    decks = userDecks.decks;
    isFetching = false;
  }

  onMount(() => {
    fetchDecks();
  });

  const removeDeck = async (deckId: string) => {
    isFetching = true;
    const message = await trpcClient.deck.removeUserDeck.mutate(deckId);
    pushNewMessage(message);
    if (message.state == "Success") {
      fetchDecks();
    } else {
      isFetching = false;
    }
  }

  const addCardsToDeck = (deckId: string) => {
    location.assign(`/home/?deckId=${deckId}`);
  }

  const goToUserDeck = (deckId: string) => {
    location.assign(`/pokemons/${deckId}`)
  }

</script>

<div class={twMerge("flex flex-col w-full h-full gap-5 px-5",
  decks.length == 0 && "justify-start")}>
  <CreateDeck {showModal} />
  {#if isFetching}
   <div class="absolute inset-0 z-[100] backdrop-blur-md flex justify-center items-center"> 
     <Spinner className="w-60 h-60 text-orange-500 z-[101]" />
   </div>
  {/if}
  <p class="font-coiny text-3xl mt-4 w-full text-end">
    Total Decks Amount: {decks?.length}/
    {import.meta.env.PUBLIC_USER_MAX_DECKS}
  </p>
  <div
    class={twMerge(cardsGridStyle)}
  >
   <AddDeckCard onClick={() => (showModal = true)} />
   {#each decks as deck, index (deck.id)}
     <Motion let:motion
       initial={{
         opacity: 0,
         scale: 0,
         rotateY: 180,
         perspective: "600px",
       }}
       animate={["entrance", "rotate"]}
       variants={animationVariants}
       transition={{
         duration: 0.1,
         type: "spring",
         stiffness: 200,
         delay: 0.15 * index,
       }}
     >
      <div
        use:motion
      >
        <DeckCard
          onClick={goToUserDeck}
          deck={deck}
          addCard={addCardsToDeck}
          removeDeck={removeDeck}
        />
      </div>
     </Motion>
   {/each}
  </div>
</div>
