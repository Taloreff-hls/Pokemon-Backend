import { Router } from "express";
import { pokemonController } from "../controller/pokemons.controller";
import { pokemonsValidation } from "../validation/pokemons.validation";

const router = Router();

/**
 * @swagger
 * /pokemons/random:
 *   get:
 *     summary: Get a random Pokémon that is not owned by the user.
 *     description: Returns a random Pokémon that is not in the user's collection.
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The ID of the user requesting a random Pokémon.
 *     responses:
 *       200:
 *         description: A random Pokémon that the user does not own.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 type:
 *                   type: array
 *                   items:
 *                     type: string
 *                 hp:
 *                   type: integer
 *                 attack:
 *                   type: integer
 *                 defense:
 *                   type: integer
 *                 speed:
 *                   type: integer
 *                 description:
 *                   type: string
 *                 image:
 *                   type: string
 *                 height:
 *                   type: string
 *                 weight:
 *                   type: string
 *                 abilities:
 *                   type: array
 *                   items:
 *                     type: string
 *               example:
 *                 id: "641"
 *                 name: "Tornadus"
 *                 type: ["Flying"]
 *                 hp: 79
 *                 attack: 115
 *                 defense: 70
 *                 speed: 111
 *                 description: "Tornadus expels massive energy from its tail, causing severe storms."
 *                 image: "https://raw.githubusercontent.com/Purukitto/pokemon-data.json/master/images/pokedex/hires/641.png"
 *                 height: "1.5 m"
 *                 weight: "63 kg"
 *                 abilities: ["Prankster", "Defiant"]
 *       400:
 *         description: Invalid or missing userId.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "userId must be a valid UUID"
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "An error occurred while fetching pokemons"
 */

router.get(
  "/random",
  pokemonsValidation.validateGetRandomPokemon,
  pokemonController.getRandomPokemon
);

/**
 * @swagger
 * /pokemons:
 *   post:
 *     summary: Get filtered Pokémon with pagination and sorting options.
 *     description: Fetch a list of Pokémon with filtering, sorting, and pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: true
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: true
 *         description: The number of items per page.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sorting criteria (e.g., 'name', 'hp', 'attack', 'speed').
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Filter Pokémon by name or type.
 *     responses:
 *       200:
 *         description: A paginated list of Pokémon.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   type:
 *                     type: array
 *                     items:
 *                       type: string
 *                   hp:
 *                     type: integer
 *                   attack:
 *                     type: integer
 *                   defense:
 *                     type: integer
 *                   speed:
 *                     type: integer
 *                   description:
 *                     type: string
 *                   image:
 *                     type: string
 *                   height:
 *                     type: string
 *                   weight:
 *                     type: string
 *                   abilities:
 *                     type: array
 *                     items:
 *                       type: string
 *               example:
 *                 id: "641"
 *                 name: "Tornadus"
 *                 type: ["Flying"]
 *                 hp: 79
 *                 attack: 115
 *                 defense: 70
 *                 speed: 111
 *                 description: "Tornadus expels massive energy from its tail, causing severe storms."
 *                 image: "https://raw.githubusercontent.com/Purukitto/pokemon-data.json/master/images/pokedex/hires/641.png"
 *                 height: "1.5 m"
 *                 weight: "63 kg"
 *                 abilities: ["Prankster", "Defiant"]
 *       400:
 *         description: Invalid or missing pagination parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Invalid pagination parameters"
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "An error occurred while fetching pokemons"
 */

router.post(
  "/",
  pokemonsValidation.validateGetPokemons,
  pokemonController.getPokemons
);

export default router;
