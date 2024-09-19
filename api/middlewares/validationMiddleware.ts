import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const validatePokemonList = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
      userId: Joi.string().uuid().optional(),
    }).optional(),
  });

  const { error } = schema.validate(
    {
      sort: req.query.sort,
      page: req.query.page,
      limit: req.query.limit,
      filter: req.body.filter,
    },
    { allowUnknown: false }
  );

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

export { validatePokemonList };
