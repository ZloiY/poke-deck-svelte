<script lang="ts">
    import { z } from "zod";
  import Button from "./Button.svelte";
  import Input from "./Input.svelte";
  import { Form, createForm } from "svelte-forms-lib";
    import { tokenStorage } from "src/utils/accessTokenStore";

  const passwordRegExp = /(\w+\d+[!&\?@#\$%\^\*]+)/ 
  type FormData = {
    username: string;
    password: string;
  }
  
  let isFetching = false;
  let isSuccess = false;
  let isFailed = false;

  $:isLoading = (isFetching || isSuccess) && !isFailed;

  const { form, errors, handleChange } = createForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: ({ username = "", password = "" }: FormData) => {
      let err = {
        username: '',
        password: '',
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
      return err;
    },
    onSubmit: () => {},
  });
 const onSubmit = async (form: FormData) => {
      console.log('submit');
    isLoading = true;
    const reposne = await fetch("/api/login", {
      method: 'POST',
      body: JSON.stringify(form),
    })
    const parsedBody = await reposne.json();
    const responseSchema = z.object({
      id: z.string(),
      status: z.string(),
      message: z.string(),
      access_token: z.string().nullish(),
    })
    const validatedBody = responseSchema.safeParse(parsedBody);
    if (validatedBody.success) {
      isLoading = false;
      isSuccess = true;
      isFailed = false;
      const { access_token, ...message } = validatedBody.data;
      if (access_token) {
       tokenStorage.set(access_token);
       location.assign("/home");
      }
    } else {
      isFailed = true;
    }
  }


</script>
<div class="flex items-center justify-center relative font-fredoka w-full">
  <div class="flex items-center justify-center w-full">
    <form
      on:submit={(event) => {
        event.preventDefault();
        onSubmit($form);
      }}
      class="flex flex-col gap-5 sm:rounded-lg text-xl bg-purple-900 p-5 
        sm:shadow-[0px_0px_20px_5px] sm:shadow-zinc-600/50 w-full max-w-2xl
        shadow-none rounded-none"
    >
      <Input
        id="username"
        name="username"
        label="Username:"
        value={$form.username}
        on:change={handleChange}
        labelStyles="text-2xl"
        inputStyles="text-2xl h-14"
        errorStyles="text-lg"
        error={$errors.username}
      />
      <Input
        id="password"
        name="password"
        label="Password:"
        type="password"
        value={$form.password}
        on:change={handleChange}
        inputStyles="text-2xl h-14"
        labelStyles="text-2xl"
        errorStyles="text-lg"
        error={$errors.password}
      />
      <Button
        className="text-2xl py-2 h-12"
        isLoading={isLoading}
        type="submit"
      >
        Log In
      </Button>
      <span>
        Don&apos;t have account?
        <a
          href="/registration"
          class="ml-1 text-blue-300 underline hover:text-yellow-400"
        >
          Create one!
        </a>
      </span>
    </form>
  </div>
</div>

