import superjson from "superjson";

import { createTRPCProxyClient, httpBatchLink, loggerLink } from "@trpc/client";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "./server/api/root";
import { getAuthHeader } from "./utils/accessTokenStore";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (import.meta.env.VERCEL_URL)
    return `https://${import.meta.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${import.meta.env.PORT ?? 3000}`; // dev SSR should use localhost
};

/**
 * A set of typesafe react-query hooks for your tRPC API
 */
export const trpcAstro = createTRPCProxyClient<AppRouter>({
  /**
   * Transformer used for data de-serialization from the server
   * @see https://trpc.io/docs/data-transformers
   **/
  transformer: superjson,

  /**
   * Links used to determine request flow from client to server
   * @see https://trpc.io/docs/links
   * */
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      headers() {
        return { Authorization: getAuthHeader() };
      },
    }),
  ],
});

/**
 * Inference helper for inputs
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;
/**
 * Inference helper for outputs
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;
