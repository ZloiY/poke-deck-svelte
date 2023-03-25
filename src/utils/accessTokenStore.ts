import { derived, readonly, writable } from "svelte/store";
import { decodeToken } from "./token";
import { setAuthHeader } from "src/api";

const localToken = typeof window !== 'undefined' && localStorage.getItem("poke_deck_svelte_token");

const tokenStorage = writable(localToken);
tokenStorage.subscribe((newToken) => {
  if (newToken && typeof window !== 'undefined') {
    localStorage.setItem("poke_deck_svelte_token", newToken);
    setAuthHeader(newToken);
  }
});

export const setTokenStorage = (token: string | null) => {
  tokenStorage.set(token);
}

export const resetTokens = () => {
  localStorage.setItem("poke_deck_svelte_token", "");
  setAuthHeader("");
  tokenStorage.set(null);
}

export const authPayload = derived(readonly(tokenStorage), ($tokenStorage) => {
  if ($tokenStorage) {
    return decodeToken($tokenStorage);
  }
  return null;
});
