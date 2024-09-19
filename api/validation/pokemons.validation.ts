import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const pokemonsValidation = {
  validateGetRandomPokemon,
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
