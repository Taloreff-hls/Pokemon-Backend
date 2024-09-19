import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const pokemonListSchema = Joi.object({
  page: Joi.number().integer().min(1).required(),
  limit: Joi.number().integer().min(1).required(),
  sort: Joi.string().optional(),
  filters: Joi.object().optional(),
});

export const validatePokemonList = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = pokemonListSchema.validate(req.query);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
