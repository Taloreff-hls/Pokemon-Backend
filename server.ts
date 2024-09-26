import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import pokemonRoutes from "./api/route/pokemons.route";

dotenv.config();

export const app = express();
const port = process.env.PORT || 4000;

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve("public")));
} else {
  const corsOptions = {
    origin: "*",
    credentials: true,
  };
  app.use(cors(corsOptions));
}

app.use(cors());
app.use(express.json());

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Pokémon API",
      version: "1.0.0",
      description: "API for Pokémon Web game",
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Local Development Server",
      },
    ],
  },
  apis: ["./api/route/*.ts"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/pokemons", pokemonRoutes);

app.get("/", (req, res) => {
  res.send("Pokedex backend is running!");
});

app.get("/**", (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
