import { SortOption } from "../interfaces/sort.interfaces";

export function mapSortOption(option: string): SortOption | undefined {
  switch (option) {
    case "Alphabetical A-Z":
      return { field: "name", order: "asc" };
    case "Alphabetical Z-A":
      return { field: "name", order: "desc" };
    case "Power (High to low)":
      return { field: "attack", order: "desc" };
    case "Power (Low to high)":
      return { field: "attack", order: "asc" };
    case "HP (High to low)":
      return { field: "hp", order: "desc" };
    case "HP (Low to high)":
      return { field: "hp", order: "asc" };
    default:
      return undefined;
  }
}
