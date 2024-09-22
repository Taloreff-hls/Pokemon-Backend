export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export interface getRandomPokemonReq {
  userId: string;
}
