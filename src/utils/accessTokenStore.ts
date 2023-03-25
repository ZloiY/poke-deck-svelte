import { derived, readonly, writable } from "svelte/store";
import { decodeToken } from "./token";
import { setAuthHeader } from "src/api";

const localToken = typeof window !== 'undefined' && localStorage.getItem("poke_deck_svelte_token");

export const tokenStorage = writable(localToken);
tokenStorage.subscribe((newToken) => {
  if (newToken && typeof window !== 'undefined') {
    localStorage.setItem("poke_deck_svelte_token", newToken);
    setAuthHeader(newToken);
  }
});

export const resetTokens = () => {
  localStorage.setItem("poke_deck_svelte_token", "");
  setAuthHeader("");
  tokenStorage.set(null);
}

export const authToken = readonly(tokenStorage);
export const authHeader = derived(authToken, ($authToken) =>
  $authToken ? `Bearer ${$authToken}` : ""
);
export const authPayload = derived(authToken, ($tokenStorage) => {
  if ($tokenStorage) {
    return decodeToken($tokenStorage);
  }
  return null;
});
