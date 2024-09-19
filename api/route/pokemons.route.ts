import express from "express";
import { validatePokemonList } from "../middlewares/validationMiddleware";
import { listPokemons } from "../controller/pokemons.controller";

const router = express.Router();

router.post("/pokemons", validatePokemonList, listPokemons);

export default router;
