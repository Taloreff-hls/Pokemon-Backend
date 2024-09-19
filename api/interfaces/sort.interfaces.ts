export type SortOrder = "asc" | "desc";

export interface SortOption {
  field: "name" | "hp" | "attack";
  order: SortOrder;
}

export interface Filters {
  name?: string;
  userId?: string;
}

export interface PokemonQueryOptions {
  sort?: SortOption;
  page: number;
  limit: number;
  filters?: Filters;
}
