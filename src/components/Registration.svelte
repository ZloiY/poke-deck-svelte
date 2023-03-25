<script lang="ts">
  import Button from "./Button.svelte";
  import Input from "./Input.svelte";
  import { createForm } from "svelte-forms-lib";
  import { passwordRegExp } from "src/utils/constants";
    import { trpcAstro } from "src/api";
    import { pushNewMessage } from "src/utils/notificationStore";
    import { setTokenStorage } from "src/utils/accessTokenStore";
    import { z } from "zod";

  type FormData = {
    username: string;
    password: string;
    repeatPassword: string;
  };

  let isFetching = false;
  let isSuccess = false;
  let isFailed = false;

  $:isLoading = (isFetching || isSuccess) && !isFailed;

  const { form, errors, handleChange, isValid } = createForm({
    initialValues: {
      username: "",
      password: "",
      repeatPassword: "",
    },
    validate: ({ username = "", password = "", repeatPassword = "" }: FormData) => {
      let err = {
        username: '',
        password: '',
        repeatPassword: '',
      };
      switch(true) {
        case !username || username.length == 0: {
          err.username = "You should enter username";
          break;
        }
        case username && username.length <= 2: {
          err.username = "Username should be at least 3 symbols";
          break;
        }
        case username.length > 12: {
          err.username = "Username to long no more than 12 symbols";
          break;
        }
      }
      switch (true) {
        case password.length == 0: {
          err.password = "You should enter password";
          break;
        }
        case password.length < 8: {
          err.password = "Password should contain at least 8 symbols";
          break;
        }
        case password.length > 16: {
          err.password = "Password shouldn't be longer than 16 symbols";
          break;
        }
        case !passwordRegExp.test(password): {
          err.password = "Password should contain numbers, letters and at least one of this !$#%^?*@";
          break;
        }
      }
      if (repeatPassword != $form.password) {
        err.repeatPassword = "You should repeate the password";
      }
      return err;
    },
    onSubmit: () => {},
  });

  const handleSubmit = async (form: FormData) => {
    isLoading = true;
    isFailed = false;
    isSuccess = false;
    const message = await trpcAstro.auth.signUp.mutate(form);
    pushNewMessage(message);
    if (message.state == "Success") {
      const reposne = await fetch("/api/login", {
        method: 'POST',
        body: JSON.stringify(form),
      })
      const parsedBody = await reposne.json();
      const responseSchema = z.object({
        id: z.string(),
        state: z.string()
          .refine(val => val == 'Success' || val == 'Failure')
          .transform(val => val as Message['state']),
        message: z.string(),
        access_token: z.string().nullish(),
      })
      const validatedBody = responseSchema.safeParse(parsedBody);
      if (validatedBody.success) {
        isLoading = false;
        isSuccess = true;
        isFailed = false;
        const { access_token, ...message } = validatedBody.data;
        pushNewMessage(message);
        if (access_token) {
         setTokenStorage(access_token);
         location.assign("/home");
        }
      }
    } else {
      isFailed = true;
    }
  }

</script>

<div class="flex w-full items-center justify-center font-fredoka relative">
  <form
    class="flex flex-col gap-5 sm:rounded-lg text-xl bg-purple-900 p-5 
        sm:shadow-[0px_0px_20px_5px] sm:shadow-zinc-600/50 w-full max-w-2xl
        rounded-none shadow-none"
    on:submit|preventDefault={() => isValid && handleSubmit($form)}
  >
    <Input
      id="username"
      label="Username:"
      labelStyles="text-2xl"
      inputStyles="text-2xl h-14"
      errorStyles="text-lg"
      value={$form.username}
      error={$errors.username}
      on:change={handleChange}
    />
    <Input
      id="password"
      type="password"
      label="Password:"
      labelStyles="text-2xl"
      inputStyles="text-2xl h-14"
      errorStyles="text-lg"
      value={$form.password}
      error={$errors.password}
      on:change={handleChange}
    />
    <Input
      id="repeatPassword"
      type="password"
      label="Repeat Password:"
      labelStyles="text-2xl"
      inputStyles="text-2xl h-14"
      errorStyles="text-lg"
      value={$form.repeatPassword}
      error={$errors.repeatPassword}
      on:change={handleChange}
    />
    <Button
      className="text-2xl h-12"
      type="submit"
      isLoading={isLoading}
    >
      Register
    </Button>
    <span>
      Already have account?
      <a
        href="/login"
        class="ml-1 text-blue-300 underline hover:text-yellow-400"
      >
        Log in!
      </a>
    </span>
  </form>
</div>

