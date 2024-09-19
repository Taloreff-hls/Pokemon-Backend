import request from "supertest";
import { app } from "../../server";
import { prisma } from "../utils/prisma";
import { pokemonService } from "../service/pokemons.service";
import { Pokemon } from "../interfaces/pokemons.interfaces";

describe("POST /pokemons", () => {
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
    await prisma.userPokemon.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
  });

  it("should return paginated results with default values", async () => {
    const response = await request(app).post("/pokemons").send({});

    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name");
    expect(response.body[0]).toHaveProperty("type");
    expect(response.body[0]).toHaveProperty("hp");
    expect(response.body[0]).toHaveProperty("attack");
    expect(response.body[0]).toHaveProperty("defense");
    expect(response.body[0]).toHaveProperty("speed");
    expect(response.body[0]).toHaveProperty("description");
    expect(response.body[0]).toHaveProperty("image");
    expect(response.body[0]).toHaveProperty("abilities");
    expect(response.body[0]).toHaveProperty("height");
    expect(response.body[0]).toHaveProperty("weight");
  });

  it("should return sorted results", async () => {
    const AlphabeticalAsc = await request(app)
      .post("/pokemons")
      .send({ sort: "Alphabetical A-Z" });

    expect(AlphabeticalAsc.status).toBe(200);
    expect(AlphabeticalAsc.body[0].name).toBe("Abomasnow");

    const HPDesc = await request(app)
      .post("/pokemons")
      .send({ sort: "HP (High to low)" });

    expect(HPDesc.status).toBe(200);
    expect(HPDesc.body[0].name).toBe("Kartana");
  });

  it("should return filtered results", async () => {
    const response = await request(app)
      .post("/pokemons")
      .send({ filter: { name: "Pikachu" } });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe("Pikachu");
  });

  it("should return paginated results with custom page and limit", async () => {
    const response = await request(app)
      .post("/pokemons")
      .send({ page: 2, limit: 2 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).not.toBe("Bulbasaur");
  });

  it("should return a 400 error for invalid pagination values", async () => {
    const response = await request(app)
      .post("/pokemons")
      .send({ page: 0, limit: 101 });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return a 400 error for an invalid sort option", async () => {
    const response = await request(app)
      .post("/pokemons")
      .send({ sort: "Invalid Sort" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return user-specific Pokemons when userId is provided", async () => {
    const response = await request(app)
      .post("/pokemons")
      .send({ filter: { userId } });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(
      response.body.some((p: Pokemon) => p.name === "Bulbasaur")
    ).toBeTruthy();
    expect(
      response.body.some((p: Pokemon) => p.name === "Charmander")
    ).toBeTruthy();
  });

  it("should handle server errors gracefully", async () => {
    jest.spyOn(pokemonService, "getPokemons").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const response = await request(app).post("/pokemons").send({});

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error", "Failed to fetch pokemons");
  });
});
