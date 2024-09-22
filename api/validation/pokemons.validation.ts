import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const pokemonsValidation = {
  validateCatchPokemon,
};

function validateCatchPokemon(req: Request, res: Response, next: NextFunction) {
  const schema = Joi.object({
    userId: Joi.string().uuid().required(),
    pokemonId: Joi.string().required(),
  });

  const { error } = schema.validate({
    userId: req.params.id,
    pokemonId: req.body.pokemonId,
  });

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
}
