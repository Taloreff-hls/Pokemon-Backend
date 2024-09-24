import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const pokemonsValidation = {
  validateGetRandomPokemon,
  validateGetPokemons,
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

function validateGetPokemons(req: Request, res: Response, next: NextFunction) {
  const querySchema = Joi.object({
    sort_by: Joi.string().valid("name", "hp", "attack").optional(),
    sort_order: Joi.string().valid("asc", "desc").optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  });

  const bodySchema = Joi.object({
    name: Joi.string().optional(),
    user_id: Joi.string().uuid().optional(),
  });

  const { error: queryError, value: validatedQuery } = querySchema.validate(
    req.query
  );

  if (queryError) {
    return res.status(400).json({ error: queryError.details[0].message });
  }

  const { error: bodyError, value: validatedBody } = bodySchema.validate(
    req.body
  );

  if (bodyError) {
    return res.status(400).json({ error: bodyError.details[0].message });
  }

  req.query = validatedQuery;
  req.body = validatedBody;

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
