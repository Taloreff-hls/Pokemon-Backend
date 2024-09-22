import request from "supertest";
import { app } from "../../server";
import { prisma } from "../utils/prisma";
import { pokemonService } from "../service/pokemons.service";
import { v4 as uuidv4 } from "uuid";

describe("GET /pokemons/random", () => {
  let userId: string;

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
  });

  it("should return a random Pokémon that is not owned by the user", async () => {
    await prisma.pokemon.createMany({
      data: [
        {
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
        {
          id: "2",
          name: "Charmander",
          hp: 39,
          attack: 52,
          defense: 43,
          speed: 65,
          description: "A fire Pokémon",
          image: "image_url",
          type: ["Fire"],
          abilities: ["Blaze"],
          height: "0.6 m",
          weight: "8.5 kg",
        },
        {
          id: "3",
          name: "Squirtle",
          hp: 44,
          attack: 48,
          defense: 65,
          speed: 43,
          description: "A water Pokémon",
          image: "image_url",
          type: ["Water"],
          abilities: ["Torrent"],
          height: "0.5 m",
          weight: "9.0 kg",
        },
        {
          id: "4",
          name: "Caterpie",
          hp: 40,
          attack: 50,
          defense: 60,
          speed: 70,
          description: "A water Pokémon",
          image: "image_url",
          type: ["Water"],
          abilities: ["Torrent"],
          height: "0.5 m",
          weight: "9.0 kg",
        },
        {
          id: "5",
          name: "Pikachu",
          hp: 44,
          attack: 48,
          defense: 65,
          speed: 43,
          description: "A electric Pokémon",
          image: "image_url",
          type: ["Electric"],
          abilities: ["Torrent"],
          height: "0.5 m",
          weight: "9.0 kg",
        },
      ],
    });

    await prisma.userPokemon.createMany({
      data: [
        { user_id: userId, pokemon_id: "1" },
        { user_id: userId, pokemon_id: "2" },
      ],
    });

    const response = await request(app)
      .get(`/pokemons/random`)
      .query({ userId })
      .expect(200);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("type");
    expect(response.body).toHaveProperty("hp");
    expect(response.body).toHaveProperty("attack");
    expect(response.body).toHaveProperty("defense");
    expect(response.body).toHaveProperty("speed");
    expect(response.body).toHaveProperty("description");
    expect(response.body).toHaveProperty("image");
    expect(response.body).toHaveProperty("abilities");
    expect(response.body).toHaveProperty("height");
    expect(response.body).toHaveProperty("weight");

    const returnedPokemonId = response.body.id;

    const ownedPokemonAfter = await prisma.userPokemon.findFirst({
      where: {
        user_id: userId,
        pokemon_id: returnedPokemonId,
      },
    });

    expect(ownedPokemonAfter).toBeNull();
  });

  it("should return an error for an invalid userId format", async () => {
    const invalidUserId = -1;

    const response = await request(app)
      .get(`/pokemons/random`)
      .query({ userId: invalidUserId })
      .expect(400);

    expect(response.body).toHaveProperty(
      "message",
      '"userId" must be a valid GUID'
    );
  });

  it("should return an error if the user does not exist", async () => {
    const nonExistentUserId = uuidv4();

    const response = await request(app)
      .get(`/pokemons/random`)
      .query({ userId: nonExistentUserId })
      .expect(404);

    expect(response.body).toHaveProperty("error", "User not found");
  });

  it("should return an empty array if there are no Pokémon in the table", async () => {
    const response = await request(app)
      .get(`/pokemons/random`)
      .query({ userId })
      .expect(200);

    expect(response.body).toEqual([]); // Ensure the response is an empty array
  });

  it("should return a 500 error if there is an internal service error", async () => {
    jest.spyOn(pokemonService, "getRandomPokemon").mockImplementation(() => {
      throw new Error("Internal Server Error");
    });

    const response = await request(app)
      .get(`/pokemons/random`)
      .query({ userId });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty(
      "error",
      "An error occurred while fetching pokemons"
    );
  });
});
