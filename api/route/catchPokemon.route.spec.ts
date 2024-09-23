import request from "supertest";
import { app } from "../../server";
import { prisma } from "../utils/prisma";
import { v4 as uuidv4 } from "uuid";

describe("POST /pokemons/users/:id/catch", () => {
  let userId: string;
  let pokemonId: string;

  beforeEach(async () => {
    await prisma.userPokemon.deleteMany({});
    await prisma.pokemon.deleteMany({});
    await prisma.user.deleteMany({});

    const user = await prisma.user.create({
      data: {
        email: "testuser@example.com",
      },
    });
    userId = user.id;

    const pokemon = await prisma.pokemon.create({
      data: {
        id: "1",
        name: "Bulbasaur",
        hp: 45,
        attack: 49,
        defense: 49,
        speed: 45,
        description: "A grass Pokémon",
        image: "image_url",
        type: ["Grass"],
        abilities: ["Overgrow"],
        height: "0.7 m",
        weight: "6.9 kg",
      },
    });

    pokemonId = pokemon.id;
  });

  it("should catch a Pokémon and add it to the user's collection", async () => {
    const response = await request(app)
      .post(`/pokemons/users/${userId}/catch`)
      .send({
        pokemonId,
      })
      .expect(200);

    expect(response.body).toHaveProperty(
      "message",
      "Pokemon successfully caught!"
    );

    const userPokemon = await prisma.userPokemon.findFirst({
      where: {
        user_id: userId,
        pokemon_id: pokemonId,
      },
    });

    expect(userPokemon).not.toBeNull();
    expect(userPokemon?.user_id).toEqual(userId);
    expect(userPokemon?.pokemon_id).toEqual(pokemonId);
  });

  it("should return an error if the user already owns the Pokémon", async () => {
    await prisma.userPokemon.create({
      data: {
        user_id: userId,
        pokemon_id: pokemonId,
      },
    });

    const response = await request(app)
      .post(`/pokemons/users/${userId}/catch`)
      .send({
        pokemonId,
      })
      .expect(400);

    expect(response.body).toHaveProperty(
      "error",
      "User already owns this Pokémon"
    );
  });

  it("should return an error for an invalid userId", async () => {
    const invalidUserId = "invalid-uuid";

    const response = await request(app)
      .post(`/pokemons/users/${invalidUserId}/catch`)
      .send({
        pokemonId,
      })
      .expect(400);

    expect(response.body).toHaveProperty("message");
  });

  it("should return an error if the Pokémon does not exist", async () => {
    const nonExistentPokemonId = uuidv4();

    const response = await request(app)
      .post(`/pokemons/users/${userId}/catch`)
      .send({
        pokemonId: nonExistentPokemonId,
      })
      .expect(404);

    expect(response.body).toHaveProperty("error", "Pokemon not found");
  });

  it("should return a 500 error if there is an internal server error", async () => {
    jest.spyOn(prisma.userPokemon, "create").mockImplementation(() => {
      throw new Error("Internal Server Error");
    });

    const response = await request(app)
      .post(`/pokemons/users/${userId}/catch`)
      .send({
        pokemonId,
      });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty(
      "error",
      "An error occurred while catching the Pokémon"
    );
  });
});
