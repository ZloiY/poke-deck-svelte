import { Readable, readonly, writable } from "svelte/store";

type PaginationReturn = {
  currentPageParams: { limit: number; offset: number };
  nextPageParams: { limit: number; offset: number } | null;
  prevPageParams: { limit: number; offset: number } | null;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  currentPage: number;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  paginationState: Readable<PaginationState>;
};

type PaginationParams = {
  page: number;
  limit: number;
  totalLength: number;
  onNextPage: (nextPage: number) => void; 
  onPrevPage: (prevPage: number) => void;
};

const calcOffset = (page: number, limit: number) => page * limit;

const paginationStateStore = writable<PaginationState>("Initial");
const paginationState = readonly(paginationStateStore);

export const pagination = ({
  page,
  limit,
  totalLength,
  onNextPage,
  onPrevPage,
}: PaginationParams): PaginationReturn => {
  paginationStateStore.set("Initial");
  const totalPages = Math.ceil(totalLength / limit);
  if (page > totalPages || page < 0) {
    throw new Error("Wrong page");
  }
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 0;
  
  const goToNextPage = () => {
    if (hasNextPage) {
      paginationStateStore.set("Next");
      onNextPage(page + 1);
    }
  }

  const goToPrevPage = () => {
    if (hasPrevPage) {
      paginationStateStore.set("Prev");
      onPrevPage(page - 1);
    }
  }

  return {
    currentPageParams: { limit, offset: calcOffset(page, limit) },
    nextPageParams: hasNextPage
      ? { limit, offset: calcOffset(page + 1, limit) }
      : null,
    prevPageParams: hasPrevPage
      ? { limit, offset: calcOffset(page - 1, limit) }
      : null,
    hasPrevPage,
    hasNextPage,
    currentPage: page,
    goToNextPage,
    goToPrevPage,
    paginationState
  }
}
