<script lang="ts">
  import type { Pokemon } from "pokenode-ts";
  import { twMerge } from "tailwind-merge";
  import { createForm } from "svelte-forms-lib";
  import Input from "../Input.svelte";
  import Button from "../Button.svelte";
  import ModalContainer from "./ModalContainer.svelte";
  import Checkbox from "../Checkbox.svelte";
  import { trpcAstro } from "src/api";
  import { pushNewMessage } from "src/utils/notificationStore";
  import { authHeader } from "src/utils/accessTokenStore";

  export let showModal = false;
  export let cards: Pokemon[]  = [];
  const trpcClient = trpcAstro($authHeader);

  const { form, errors, handleChange, isValid } = createForm({
    initialValues: {
      name: "",
      private: false,
    },
    validate: () => {
      if ($form.name.length == 0) {
        return { name: "Deck name couldn't be empty." };
      }
      if ($form.name.length < 3) {
        return { name: "Deck name should be longer than 3 symbols." };
      }
      if ($form.name.length > 15) {
        return { name: "Deck name should be less than 15 symbols." };
      }
    },
    onSubmit: () => {},
  })
 
  $:isLoading = false;

  const onSubmit = (closeModal: () => void) => async () => {
    if ($isValid) {
      isLoading = true;
      const message = await trpcClient.deck.createDeck.mutate({ ...$form,
        cards: cards.map((pokemon) => ({
          name: pokemon.name,
          imageUrl: pokemon.sprites.other?.["official-artwork"].front_default ??
          pokemon.sprites.front_default ?? "",
        }))
      }); 
      isLoading = false;
      pushNewMessage(message);
      closeModal();
    }
  }

</script>
<ModalContainer let:closeDialog title="Create new deck" bind:showModal={showModal}>
  <div class="gap-5 p-4">
    <form
      class="flex flex-col w-full gap-5"
      on:submit|preventDefault={onSubmit(closeDialog)}
    >
      <div
        class={twMerge(
          "flex gap-5 justify-between items-end",
          $errors.name && "items-center",
        )}
      >
        <Input
          label="Deck name:"
          name="name"
          on:change={handleChange}
          containerStyles="max-w-[220px]"
          error={$errors.name}
        />
        <Button
          type="submit"
          disabled={!$isValid}
          isLoading={isLoading}
          className="bg-green-500 whitespace-nowrap text-xl px-3 h-10"
        >
          Create Deck!
        </Button>
      </div>
      <Checkbox
        name="private"
        on:change={handleChange}
        className="w-5 h-5"
        label="Make this deck private?"
      />
    </form>
  </div>
</ModalContainer>

