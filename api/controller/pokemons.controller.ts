import { Request, Response } from "express";
import { pokemonService } from "../service/pokemons.service";

export const getRandomPokemon = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query as { userId: string };

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const pokemon = await pokemonService.getRandomPokemon(userId);
    res.json(pokemon);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching pokemons" });
  }
};
