import request from "supertest";
import { app } from "../../server";
import { prisma } from "../utils/prisma";
import { pokemonService } from "../service/pokemons.service";

describe("GET /pokemons/random", () => {
  let userId: string;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        email: "testuser@example.com",
      },
    });
    userId = user.id;

    await prisma.userPokemon.createMany({
      data: [
        { userId, pokemonId: "1" },
        { userId, pokemonId: "2" },
        { userId, pokemonId: "3" },
      ],
    });
  });

  afterAll(async () => {
    await prisma.userPokemon.deleteMany({
      where: { userId },
    });

    await prisma.user.delete({
      where: { id: userId },
    });
  });

  it("should return a random Pokémon that is not owned by the user", async () => {
    const response = await request(app)
      .get(`/pokemons/random`)
      .query({ userId });

    expect(response.status).toBe(200);
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
        userId: userId,
        pokemonId: returnedPokemonId,
      },
    });

    expect(ownedPokemonAfter).toBeNull();
  });

  it("should return an error if the user does not exist", async () => {
    const nonExistentUserId = "invalid-user-id";

    const response = await request(app)
      .get(`/pokemons/random`)
      .query({ userId: nonExistentUserId });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      '"userId" must be a valid GUID'
    );
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
