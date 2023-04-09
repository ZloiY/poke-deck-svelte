# PokeDeck App 

Another app where you can do different things with pokemons.

## The tech stack

- [Astro](https://astro.build)
- [Svelte](https://svelte.dev)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [Zod](https://zod.dev/)
- [Svelte-Motion](https://svelte-motion.gradientdescent.de/)

## How to launch

First thing first you need to install npm deps via:

    pnpm install

Then you need to setup your `.env` by following `.env.example`.
Setup the `schema.prisma` file for the preferable db. In my example we will use `sqlite`.
To start using sqlite we need to do this change:

Remove

    shadowDatabaseUrl = env("SHADOW_DB_URL")
    relationMode      = "prisma"

Replace this

    provider          = "mysql"
with this

    provider          = "sqlite"

Also don't forget to create `db.sqlite` in `prisma/` directory.

Remove the `prisma/migrations/` and launch

    pnpx prisma generate

And now you can run

    pnpm run dev

