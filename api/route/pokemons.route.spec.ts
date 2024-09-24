import request from "supertest";
import { app } from "../../server";
import { prisma } from "../utils/prisma";
import { pokemonService } from "../service/pokemons.service";
import { v4 as uuidv4 } from "uuid";
import { Pokemon } from "@prisma/client";

describe("pokemons route tests", () => {
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

  describe("GET /pokemons/random", () => {
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
        .expect(400);

      expect(response.body).toHaveProperty("error", "User not found");
    });

    it("should return an empty array if there are no Pokémon in the table", async () => {
      const response = await request(app)
        .get(`/pokemons/random`)
        .query({ userId })
        .expect(200);

      expect(response.body).toEqual([]);
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

  describe("POST /pokemons", () => {
    let userId: string;

    beforeEach(async () => {
      await prisma.userPokemon.deleteMany({});

      await prisma.pokemon.deleteMany({});
      await prisma.user.deleteMany({});

      const user = await prisma.user.create({
        data: {
          email: "test@example.com",
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

      const response = await request(app)
        .post("/pokemons")
        .send({})
        .expect(200);

      const { pokemons } = response.body;
      expect(pokemons).toHaveLength(5);

      pokemons.forEach((pokemon: Pokemon) => {
        expect(pokemon).toHaveProperty("id");
        expect(pokemon).toHaveProperty("name");
        expect(pokemon).toHaveProperty("type");
        expect(pokemon).toHaveProperty("hp");
        expect(pokemon).toHaveProperty("attack");
        expect(pokemon).toHaveProperty("defense");
        expect(pokemon).toHaveProperty("speed");
        expect(pokemon).toHaveProperty("description");
        expect(pokemon).toHaveProperty("image");
        expect(pokemon).toHaveProperty("abilities");
        expect(pokemon).toHaveProperty("height");
        expect(pokemon).toHaveProperty("weight");
      });

      expect(pokemons[0].name).toBe("Bulbasaur");
      expect(pokemons[0].hp).toBe(45);
      expect(pokemons[0].type).toEqual(["Grass"]);
      expect(pokemons[0].abilities).toEqual(["Overgrow"]);
      expect(pokemons[0].height).toBe("0.7 m");
      expect(pokemons[0].weight).toBe("6.9 kg");

      expect(pokemons[4].name).toBe("Squirtle");
      expect(pokemons[4].hp).toBe(44);
    });

    it("should return sorted results by name in ascending order", async () => {
      await prisma.pokemon.createMany({
        data: [
          {
            id: "1",
            name: "Charmander",
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
            name: "Bulbasaur",
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
        .post("/pokemons?sort_by=name&sort_order=asc")
        .expect(200);

      const { pokemons } = response.body;

      expect(pokemons[0].name).toBe("Bulbasaur");
      expect(pokemons[4].name).toBe("Squirtle");
    });

    it("should return sorted results by name in descending order", async () => {
      await prisma.pokemon.createMany({
        data: [
          {
            id: "1",
            name: "Charmander",
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
            name: "Bulbasaur",
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
        .post("/pokemons?sort_by=name&sort_order=desc")
        .expect(200);

      const { pokemons } = response.body;

      expect(pokemons[0].name).toBe("Squirtle");
      expect(pokemons[4].name).toBe("Bulbasaur");
    });

    it("should return sorted results by hp in ascending order", async () => {
      await prisma.pokemon.createMany({
        data: [
          {
            id: "1",
            name: "Charmander",
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
            name: "Bulbasaur",
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
        .post("/pokemons?sort_by=hp&sort_order=asc")
        .expect(200);

      const { pokemons } = response.body;

      expect(pokemons[0].name).toBe("Bulbasaur");
      expect(pokemons[4].name).toBe("Pikachu");
    });

    it("should return sorted results by hp in descending order", async () => {
      await prisma.pokemon.createMany({
        data: [
          {
            id: "1",
            name: "Charmander",
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
            name: "Bulbasaur",
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
        .post("/pokemons?sort_by=hp&sort_order=desc")
        .expect(200);

      const { pokemons } = response.body;

      expect(pokemons[0].name).toBe("Pikachu");
      expect(pokemons[4].name).toBe("Bulbasaur");
    });

    it("should return sorted results by attack in ascending order", async () => {
      await prisma.pokemon.createMany({
        data: [
          {
            id: "1",
            name: "Charmander",
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
            name: "Bulbasaur",
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
            attack: 40,
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
        .post("/pokemons?sort_by=attack&sort_order=asc")
        .expect(200);

      const { pokemons } = response.body;

      expect(pokemons[0].name).toBe("Caterpie");
      expect(pokemons[4].name).toBe("Bulbasaur");
    });

    it("should return sorted results by attack in descending order", async () => {
      await prisma.pokemon.createMany({
        data: [
          {
            id: "1",
            name: "Charmander",
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
            name: "Bulbasaur",
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
            attack: 40,
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
        .post("/pokemons?sort_by=attack&sort_order=desc")
        .expect(200);

      const { pokemons } = response.body;

      expect(pokemons[0].name).toBe("Bulbasaur");
      expect(pokemons[4].name).toBe("Caterpie");
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

      const { pokemons } = response.body;

      expect(pokemons).toHaveLength(1);
      expect(pokemons[0].name).toBe("Pikachu");
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

      const { pokemons } = response.body;

      expect(pokemons).toHaveLength(2);
      expect(pokemons[0].name).not.toBe("Bulbasaur");
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

      const { pokemons } = response.body;

      expect(pokemons).toHaveLength(2);
      expect(
        pokemons.some((p: Pokemon) => p.name === "Bulbasaur")
      ).toBeTruthy();
      expect(
        pokemons.some((p: Pokemon) => p.name === "Charmander")
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
        .post("/pokemons?page=1&limit=3&sort_by=hp&sort_order=desc")
        .send({ name: "C", user_id: userId })
        .expect(200);

      const { pokemons } = response.body;
      expect(pokemons).toHaveLength(3);
      expect(pokemons[0].name).toBe("Cobalion");
      expect(pokemons[0].hp).toBe(115);

      expect(pokemons[1].name).toBe("Claydol");
      expect(pokemons[1].hp).toBe(100);
    });

    it("should return an empty array if there are no Pokémon in the table", async () => {
      const response = await request(app)
        .post(`/pokemons`)
        .send({ name: "CCC" })
        .expect(200);

      const { pokemons } = response.body;
      expect(pokemons).toEqual([]);
    });

    it("should return an empty array for a user with no owned pokemons", async () => {
      const anotherUser = await prisma.user.create({
        data: {
          email: "anotheruser@example.com",
        },
      });

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
        ],
      });

      await prisma.userPokemon.createMany({
        data: [
          { user_id: anotherUser.id, pokemon_id: "1" },
          { user_id: anotherUser.id, pokemon_id: "2" },
        ],
      });

      const response = await request(app)
        .post("/pokemons")
        .send({ user_id: userId })
        .expect(200);

      const { pokemons } = response.body;

      expect(pokemons).toEqual([]);
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

      const { pokemons } = response.body;

      expect(pokemons).toEqual([]);
    });

    it("should return a 400 error for an invalid sort option", async () => {
      const response = await request(app)
        .post("/pokemons?sort=Invalid")
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    it("should return a 400 error for an invalid filter option", async () => {
      const response = await request(app)
        .post("/pokemons")
        .send({ invalidFilter: "InvalidValue" })
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

  describe("POST /pokemons/users/:id/catch", () => {
    let pokemonId: string;

    afterAll(async () => {
      await prisma.userPokemon.deleteMany({});
      await prisma.pokemon.deleteMany({});
      await prisma.user.deleteMany({});
    });

    it("should catch a new Pokémon and add it to the user's collection", async () => {
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

      const response = await request(app)
        .post(`/pokemons/users/${userId}/catch`)
        .send({ pokemonId })
        .expect(201);

      expect(response.body).toHaveProperty("user_id", userId);
      expect(response.body).toHaveProperty("pokemon_id", pokemonId);

      const caughtPokemon = await prisma.userPokemon.findFirst({
        where: {
          user_id: userId,
          pokemon_id: pokemonId,
        },
      });

      expect(caughtPokemon).not.toBeNull();
    });

    it("should return a 409 error if the user already owns the Pokémon", async () => {
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

      await prisma.userPokemon.create({
        data: {
          user_id: userId,
          pokemon_id: pokemonId,
        },
      });

      const response = await request(app)
        .post(`/pokemons/users/${userId}/catch`)
        .send({ pokemonId })
        .expect(409);

      expect(response.body).toHaveProperty(
        "error",
        "This Pokémon is already in your collection"
      );
    });

    it("should return a 400 error for an invalid userId", async () => {
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

      const invalidUserId = -1;

      const response = await request(app)
        .post(`/pokemons/users/${invalidUserId}/catch`)
        .send({ pokemonId })
        .expect(400);

      expect(response.body).toHaveProperty(
        "error",
        '"id" must be a valid GUID'
      );
    });

    it("should return a 400 error if the user does not exist", async () => {
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

      const nonExistentUserId = uuidv4();

      const response = await request(app)
        .post(`/pokemons/users/${nonExistentUserId}/catch`)
        .send({ pokemonId })
        .expect(400);

      expect(response.body).toHaveProperty("error", "User not found");
    });

    it("should return a 400 error for an invalid pokemonId", async () => {
      const invalidPokemonId = -1;

      const response = await request(app)
        .post(`/pokemons/users/${userId}/catch`)
        .send({ pokemonId: invalidPokemonId })
        .expect(400);

      expect(response.body).toHaveProperty(
        "error",
        '"pokemonId" must be a string'
      );
    });

    it("should return a 400 error if the pokemonId is missing", async () => {
      const response = await request(app)
        .post(`/pokemons/users/${userId}/catch`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty("error", '"pokemonId" is required');
    });

    it("should return a 404 error if the Pokémon does not exist", async () => {
      const nonExistentPokemonId = uuidv4();

      const response = await request(app)
        .post(`/pokemons/users/${userId}/catch`)
        .send({ pokemonId: nonExistentPokemonId })
        .expect(404);

      expect(response.body).toHaveProperty("error", "Pokémon not found");
    });

    it("should return a 500 error if the service fails", async () => {
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

      jest.spyOn(pokemonService, "catchPokemon").mockImplementation(() => {
        throw new Error("Internal Server Error");
      });

      const response = await request(app)
        .post(`/pokemons/users/${userId}/catch`)
        .send({ pokemonId });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error", "Failed to catch Pokémon");
    });
  });
});
