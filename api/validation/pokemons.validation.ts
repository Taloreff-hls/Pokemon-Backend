import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const pokemonsValidation = {
  validateGetRandomPokemon,
  validateCatchPokemon,
};

function validateGetRandomPokemon(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const schema = Joi.object({
    userId: Joi.string().uuid().required(),
  });

  const { error } = schema.validate(req.query);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
}

function validateCatchPokemon(req: Request, res: Response, next: NextFunction) {
  const schema = Joi.object({
    id: Joi.string().uuid().required(),
  });

  const bodySchema = Joi.object({
    pokemonId: Joi.string().required(),
  });

  const { error: paramsError } = schema.validate(req.params);
  const { error: bodyError } = bodySchema.validate(req.body);

  if (paramsError) {
    return res.status(400).json({ error: paramsError.details[0].message });
  }

  if (bodyError) {
    return res.status(400).json({ error: bodyError.details[0].message });
  }

  next();
}
