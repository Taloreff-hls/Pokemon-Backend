export type SortOrder = "asc" | "desc";

export type SortBy = "name" | "hp" | "attack";

export interface Filters {
  name?: string;
  user_id?: string;
}

export interface PokemonQueryOptions {
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  page: number;
  limit: number;
  filters?: Filters;
  pokemonIds?: string[];
}
