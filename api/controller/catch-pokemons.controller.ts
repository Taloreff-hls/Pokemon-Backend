import { Request, Response } from "express";
import { pokemonService } from "../services/pokemonService";

export const pokemonController = {
  catchPokemon,
};

async function catchPokemon(req: Request, res: Response) {
  try {
    const result = await pokemonService.catchPokemon(
      req.params.id,
      req.body.pokemonId
    );
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(error.status || 500).json({ message: error.message });
  }
}
