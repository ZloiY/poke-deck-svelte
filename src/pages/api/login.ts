import type { APIRoute } from "astro";
import sha256 from "crypto-js/sha256";
import { v4 } from "uuid";
import { z } from "zod";

import { prisma } from "../../server/db";
import { createAccessToken } from "src/utils/token";

const passwordRegEx = /[\w(@|#|$|&)+]{6}/g;

export const post: APIRoute = async ({ request }) => {
  const creds = await request.json();
  const parsedCreds = z
    .object({
      username: z.string().min(3),
      password: z.string().regex(passwordRegEx),
    })
    .safeParse(creds);
  if (parsedCreds.success) {
    const { data } = parsedCreds;
    const user = await prisma.user.findUnique({
      where: { name: data.username },
      include: { decks: true },
    });
    const hash = sha256(`${data.password}${user?.salt}`).toString();
    if (user && hash == user.hash) {
      const access_token = await createAccessToken({
        id: user.id,
        name: user.name,
        numberOfDecks: user.decks.length,
      });
      const message = {
        id: v4(),
        state: "Success",
        message: "You've succcessfully logged in!",
        access_token,
      };
      return new Response(JSON.stringify(message), {
        status: 200,
      });
    }
  }
  const message = {
    id: v4(),
    state: "Failure",
    message: "You entered wrong credentials.",
  };
  return new Response(JSON.stringify(message), {
    status: 400,
  });
};
