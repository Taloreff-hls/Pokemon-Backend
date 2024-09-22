import express from "express";
import { listPokemons } from "../controller/pokemons.controller";
import { pokemonsValidation } from "../validation/pokemons.validation";

const router = express.Router();

router.post("/", pokemonsValidation.validatePokemonList, listPokemons);

export default router;
