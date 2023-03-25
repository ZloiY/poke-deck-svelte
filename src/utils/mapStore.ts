import { derived, readonly, writable } from "svelte/store";

export const createStore = <T extends { id: string | number }>(
  initialState?: Map<string, T>
) => {
  const storeMap = new Map<string, T>(initialState);
  const store = writable(storeMap);

  const reset = () => store.set(new Map(initialState));
  const pushValue = (value: T) => {
    store.update(($storeMap) => {
      $storeMap.set(`${value.id}`, value);
      return $storeMap;
    });
  };
  const removeValue = (value: T) => {
    store.update(($storeMap) => {
      $storeMap.delete(`${value.id}`);
      return $storeMap;
    });
  };
  const valuesArr = readonly(derived(store, ($store) => [...$store.values()]));

  return {
    reset,
    pushValue,
    removeValue,
    valuesArr,
    store,
  };
};
