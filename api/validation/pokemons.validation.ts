import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const pokemonsValidation = {
  validateGetRandomPokemon,
  validateGetPokemons,
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

function validateGetPokemons(req: Request, res: Response, next: NextFunction) {
  const schema = Joi.object({
    sort: Joi.string()
      .valid(
        "Alphabetical A-Z",
        "Alphabetical Z-A",
        "Power (High to low)",
        "Power (Low to high)",
        "HP (High to low)",
        "HP (Low to high)"
      )
      .optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    filter: Joi.object({
      name: Joi.string().optional(),
      user_id: Joi.string().uuid().optional(),
    }).optional(),
  });

  const validationData = {
    ...req.query,
    filter: req.body.filter,
  };

  const { error } = schema.validate(validationData);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
}
