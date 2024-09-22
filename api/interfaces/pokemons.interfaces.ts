import { PokemonType } from "../enums/PokemonType";

export interface Pokemon {
  id: string;
  name: string;
  type: PokemonType[];
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  description: string;
  image: string;
  height: string;
  weight: string;
  abilities: [string][];
}

export interface getUserPokemonQuery {
  pokemon_id: string;
}
