import { Request, Response } from "express";
import { pokemonService } from "../service/pokemons.service";

export const pokemonController = {
  getRandomPokemon,
};

async function getRandomPokemon(req: Request, res: Response) {
  try {
    const userId = req.query.userId as string;

    const pokemon = await pokemonService.getRandomPokemon(userId);

    if (!pokemon) {
      return res.status(200).json([]);
    }

    res.status(200).json(pokemon);
  } catch (error) {
    const err = error as Error;
    if (err.message === "User not found") {
      return res.status(404).json({ error: "User not found" });
    }
    return res
      .status(500)
      .json({ error: "An error occurred while fetching pokemons" });
  }
}
