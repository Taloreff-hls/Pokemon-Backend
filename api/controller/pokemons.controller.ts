import { Request, Response } from "express";
import { pokemonService } from "../service/pokemons.service";

export const pokemonController = {
  getRandomPokemon,
};

async function getRandomPokemon(req: Request, res: Response) {
  try {
    const userId = req.query.userId as string;

    const pokemon = await pokemonService.getRandomPokemon(userId);

    res.status(200).json(pokemon);
  } catch (error) {
    const err = error as Error;
    if (err.message === "User not found") {
      return res.status(400).json({ error: "User not found" });
    }
    if (err.message === "No available pokemons") {
      return res.status(200).json([]);
    }
    return res
      .status(500)
      .json({ error: "An error occurred while fetching pokemons" });
  }
}
