import type { APIRoute } from "astro";
import { createAccessToken, decodeToken } from "src/utils/token";

export const post: APIRoute = async ({ request }) => {
  const authorizationToken = request.headers.get("Authorization");
  const access_token = authorizationToken?.split(" ")[1];
  if (access_token) {
    const maybeToken = decodeToken(access_token);
    if (maybeToken) {
      const decodeRefresh =
        JSON.parse(decodeURIComponent(atob(maybeToken.refreshToken.split('.')[1])));
      if (decodeRefresh.exp > Date.now()) {
        const newToken = await createAccessToken({
          id: maybeToken.id,
          name: maybeToken.name,
          numberOfDecks: maybeToken.numberOfDecks,
        });
        return new Response(JSON.stringify(newToken), {
          status: 200,
        });
      }
    }
  }

  return new Response(undefined, {
    status: 401,
  });
};
