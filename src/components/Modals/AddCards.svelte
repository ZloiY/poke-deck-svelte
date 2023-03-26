<script lang="ts">
  import { Motion } from "svelte-motion";
  import Remove from "@icons/close-circle.svg?component";
  import ModalContainer from "./ModalContainer.svelte";
  import PreviewCard from "../Cards/PreviewCard.svelte";
  import Button from "../Button.svelte";
  import Select from "../Select.svelte";
  import { selectedPokemons, removePokemon } from "src/utils/selectedPokemonsStore";
  import { trpcAstro } from "src/api";
  import { pushNewMessage } from "src/utils/notificationStore";
  import { authHeader } from "src/utils/accessTokenStore";

  export let deckId: string;
  export let showModal =  false;
  export let onSubmit: () => void;
  let isAdding = false;
  const trpcClient = trpcAstro($authHeader);
  let selectedDeck = trpcClient.deck.getUserDeckById.query({ deckId });
  const emptyUserDecks = trpcClient.deck.getEmptyUserDecks.query({ numberOfEmptySlots: 20 });

  const updateDeck = (closeModal: () => void) => async () => {
    const selectedDeckResolved = await selectedDeck;
    if (selectedDeckResolved) {
      isAdding = true;
      const message  = await trpcClient.deck.addCardsToDecks
        .mutate({ 
          decksIds: [selectedDeckResolved.id ],
          cards: $selectedPokemons.map((pokemon) => ({
            name: pokemon.name,
            imageUrl: pokemon.sprites.other?.["official-artwork"].front_default ??
            pokemon.sprites.front_default ?? "",
         })),
        });
      isAdding = false;
      pushNewMessage(message);
      onSubmit();
      closeModal();
    }
  }

  $:$selectedPokemons.length == 0 && (showModal = false);
</script>

<ModalContainer title="Add cards to the decks" bind:showModal let:closeDialog>
    <div class="flex flex-col gap-5 min-w-[450px] max-w-[720px] px-2 pb-4">
      <div class="flex gap-10 w-full px-1">
      {#await Promise.all([selectedDeck, emptyUserDecks]) then [selectedDeckResolved, emptyUserDecksResolved]}
        <!--<DeckCard
          class="w-32 h-52 border-yellow-500 border-2"
          notInteractive={true}
          deck={selectedDeck}
        />-->
        <Select
          value={selectedDeckResolved}
          className="w-64"
          placeholder="Select deck..."
          name="Select deck where you want to add Pokemons"
          on:change={(newDeck) => (console.log(newDeck))}
          items={emptyUserDecksResolved}
        />
      {/await}
      </div>
      <div class="flex flex-wrap justify-center gap-3">
        {#each $selectedPokemons as pokemon, index (pokemon.name)}
        <Motion let:motion
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1}}
          exit={{ opacity: 0, scale: 0 }}
          transition={{
            duration: 0.1,
            delay: index * 0.2,
            type: "spring",
            stiffness: 80,
          }}
        >
          <div use:motion class="relative">
            <PreviewCard
              className="w-32 h-52 text-xl border-yellow-500 border-2"
              pokemon={pokemon}
              notInteractive={true}
            />
            <div class="absolute top-1 right-1 w-10 h-10"
                on:click={() => removePokemon(pokemon)}
            >
              <Remove
                class="absolute top-1 right-1 w-10 h-10 text-red-600 hover:text-red-400 active:text-red-500 active:scale-90 cursor-pointer"
              />
            </div>
          </div>
        </Motion>
        {/each}
      </div>
      <Button
        isLoading={isAdding}
        className="bg-green-500 w-full h-12"
        disabled={!selectedDeck}
        on:click={updateDeck(closeDialog)}
      >
        Add Cards!
      </Button>
    </div>
</ModalContainer>

