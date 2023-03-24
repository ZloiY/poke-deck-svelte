import { derived, readonly, writable } from "svelte/store";
import { decodeToken } from "./token";

const localToken = localStorage.getItem("poke_deck_svelte_token");
export const getAuthHeader = () => {
  const token = localStorage.getItem("poke_deck_svelte_token");
  if (token) {
    return `Bearer ${token}`;
  }
  return "";
};

export const tokenStorage = writable(localToken);
tokenStorage.subscribe((newToken) => {
  if (newToken) {
    localStorage.setItem("poke_deck_svelte_token", newToken);
  }
});

export const authToken = readonly(tokenStorage);
export const authHeader = derived(authToken, ($authToken) =>
  $authToken ? `Bearer ${$authToken}` : ""
);
export const authPayload = derived(tokenStorage, ($tokenStorage) => {
  if ($tokenStorage) {
    return decodeToken($tokenStorage);
  }
  return null;
});
