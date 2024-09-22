import request from "supertest";
import { app } from "../../server";
import { prisma } from "../utils/prisma";
import { pokemonService } from "../service/pokemons.service";
import { Pokemon } from "../interfaces/pokemons.interfaces";

describe("POST /pokemons", () => {
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

  it("should return paginated results with default values", async () => {
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

    const response = await request(app).post("/pokemons").send({}).expect(200);

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
          hp: 100,
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

    const AlphabeticalAsc = await request(app)
      .post("/pokemons?sort=Alphabetical A-Z")
      .expect(200);

    expect(AlphabeticalAsc.body[0].name).toBe("Bulbasaur");

    const HPDesc = await request(app)
      .post("/pokemons?sort=HP (High to low)")
      .expect(200);

    expect(HPDesc.body[0].name).toBe("Pikachu");
  });

  it("should return filtered results", async () => {
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
          hp: 100,
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

    const response = await request(app)
      .post("/pokemons")
      .send({ name: "Pikachu" })
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe("Pikachu");
  });

  it("should return paginated results with custom page and limit", async () => {
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
          hp: 100,
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

    const response = await request(app)
      .post("/pokemons?page=2&limit=2")
      .expect(200);

    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).not.toBe("Bulbasaur");
  });

  it("should return user-specific Pokemons when userId is provided", async () => {
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
          hp: 100,
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
      .post("/pokemons")
      .send({ user_id: userId })
      .expect(200);

    expect(response.body).toHaveLength(2);
    expect(
      response.body.some((p: Pokemon) => p.name === "Bulbasaur")
    ).toBeTruthy();
    expect(
      response.body.some((p: Pokemon) => p.name === "Charmander")
    ).toBeTruthy();
  });

  it("should return filtered, sorted, and paginated results of the user", async () => {
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
          description: "A bug Pokémon",
          image: "image_url",
          type: ["Bug"],
          abilities: ["Shield Dust"],
          height: "0.5 m",
          weight: "2.9 kg",
        },
        {
          id: "5",
          name: "Pikachu",
          hp: 100,
          attack: 48,
          defense: 65,
          speed: 43,
          description: "An electric Pokémon",
          image: "image_url",
          type: ["Electric"],
          abilities: ["Static"],
          height: "0.5 m",
          weight: "9.0 kg",
        },
        {
          id: "6",
          name: "Claydol",
          hp: 100,
          attack: 70,
          defense: 35,
          speed: 72,
          description: "A normal Pokémon",
          image: "image_url",
          type: ["Normal"],
          abilities: ["Run Away"],
          height: "0.3 m",
          weight: "3.5 kg",
        },
        {
          id: "7",
          name: "Clefairy",
          hp: 70,
          attack: 45,
          defense: 40,
          speed: 56,
          description: "A flying Pokémon",
          image: "image_url",
          type: ["Normal", "Flying"],
          abilities: ["Keen Eye"],
          height: "0.3 m",
          weight: "1.8 kg",
        },
        {
          id: "8",
          name: "Cobalion",
          hp: 115,
          attack: 45,
          defense: 20,
          speed: 20,
          description: "A fairy Pokémon",
          image: "image_url",
          type: ["Fairy"],
          abilities: ["Cute Charm"],
          height: "0.5 m",
          weight: "5.5 kg",
        },
        {
          id: "9",
          name: "Corphish",
          hp: 80,
          attack: 33,
          defense: 35,
          speed: 55,
          description: "A poison Pokémon",
          image: "image_url",
          type: ["Poison", "Flying"],
          abilities: ["Inner Focus"],
          height: "0.8 m",
          weight: "7.5 kg",
        },
        {
          id: "10",
          name: "Meowth",
          hp: 40,
          attack: 45,
          defense: 35,
          speed: 90,
          description: "A normal Pokémon",
          image: "image_url",
          type: ["Normal"],
          abilities: ["Pickup"],
          height: "0.4 m",
          weight: "4.2 kg",
        },
      ],
    });

    await prisma.userPokemon.createMany({
      data: [
        { user_id: userId, pokemon_id: "1" },
        { user_id: userId, pokemon_id: "2" },
        { user_id: userId, pokemon_id: "4" },
        { user_id: userId, pokemon_id: "6" },
        { user_id: userId, pokemon_id: "7" },
        { user_id: userId, pokemon_id: "8" },
      ],
    });

    const response = await request(app)
      .post("/pokemons?page=1&limit=3&sort=HP (High to low)")
      .send({ name: "C", user_id: userId })
      .expect(200);

    expect(response.body).toHaveLength(3);
    expect(response.body[0].name).toBe("Cobalion");
    expect(response.body[0].hp).toBe(115);

    expect(response.body[1].name).toBe("Claydol");
    expect(response.body[1].hp).toBe(100);
  });

  it("should return an empty array if there are no Pokémon in the table", async () => {
    const response = await request(app)
      .post(`/pokemons`)
      .send({ name: "CCC" })
      .expect(200);

    expect(response.body).toEqual([]);
  });

  it("should return an empty array for a user with no owned pokemons", async () => {
    const response = await request(app)
      .post("/pokemons")
      .send({ user_id: userId })
      .expect(200);

    expect(response.body).toEqual([]);
  });

  it("should return a 400 error for invalid pagination values", async () => {
    const response = await request(app).post("/pokemons?page=0&limit=101");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return an empty array for a page with no results", async () => {
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
          description: "A bug Pokémon",
          image: "image_url",
          type: ["Bug"],
          abilities: ["Shield Dust"],
          height: "0.5 m",
          weight: "2.9 kg",
        },
        {
          id: "5",
          name: "Pikachu",
          hp: 100,
          attack: 48,
          defense: 65,
          speed: 43,
          description: "An electric Pokémon",
          image: "image_url",
          type: ["Electric"],
          abilities: ["Static"],
          height: "0.5 m",
          weight: "9.0 kg",
        },
        {
          id: "6",
          name: "Claydol",
          hp: 100,
          attack: 70,
          defense: 35,
          speed: 72,
          description: "A normal Pokémon",
          image: "image_url",
          type: ["Normal"],
          abilities: ["Run Away"],
          height: "0.3 m",
          weight: "3.5 kg",
        },
        {
          id: "7",
          name: "Clefairy",
          hp: 70,
          attack: 45,
          defense: 40,
          speed: 56,
          description: "A flying Pokémon",
          image: "image_url",
          type: ["Normal", "Flying"],
          abilities: ["Keen Eye"],
          height: "0.3 m",
          weight: "1.8 kg",
        },
        {
          id: "8",
          name: "Cobalion",
          hp: 115,
          attack: 45,
          defense: 20,
          speed: 20,
          description: "A fairy Pokémon",
          image: "image_url",
          type: ["Fairy"],
          abilities: ["Cute Charm"],
          height: "0.5 m",
          weight: "5.5 kg",
        },
        {
          id: "9",
          name: "Corphish",
          hp: 80,
          attack: 33,
          defense: 35,
          speed: 55,
          description: "A poison Pokémon",
          image: "image_url",
          type: ["Poison", "Flying"],
          abilities: ["Inner Focus"],
          height: "0.8 m",
          weight: "7.5 kg",
        },
        {
          id: "10",
          name: "Meowth",
          hp: 40,
          attack: 45,
          defense: 35,
          speed: 90,
          description: "A normal Pokémon",
          image: "image_url",
          type: ["Normal"],
          abilities: ["Pickup"],
          height: "0.4 m",
          weight: "4.2 kg",
        },
      ],
    });
    const response = await request(app)
      .post("/pokemons?page=3&limit=10")
      .expect(200);

    expect(response.body).toEqual([]);
  });

  it("should return a 400 error for an invalid sort option", async () => {
    const response = await request(app)
      .post("/pokemons?sort=Invalid")
      .expect(400);

    expect(response.body).toHaveProperty("error");
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
