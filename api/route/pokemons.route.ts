import { Router } from "express";
import { pokemonController } from "../controller/catch-pokemons.controller";
import { pokemonsValidation } from "../validation/pokemons.validation";

const router = Router();

/**
 * @swagger
 * /pokemons/users/{id}/catch:
 *   post:
 *     summary: Add a Pokémon to the user’s collection after a successful catch.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The user ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pokemonId:
 *                 type: string
 *                 format: uuid
 *                 description: The Pokémon ID.
 *     responses:
 *       200:
 *         description: Pokémon successfully added to the user’s collection.
 *       400:
 *         description: Invalid or missing Pokémon ID or user ID, or the user already owns the Pokémon.
 *       404:
 *         description: Pokémon not found or unavailable for catching.
 */

router.post(
  "/pokemons/users/:id/catch",
  pokemonsValidation.validateCatchPokemon,
  pokemonController.catchPokemon
);

export default router;
