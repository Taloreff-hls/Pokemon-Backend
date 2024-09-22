/*
  Warnings:

  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pokemonId` on the `UserPokemon` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserPokemon` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,pokemon_id]` on the table `UserPokemon` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pokemon_id` to the `UserPokemon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `UserPokemon` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserPokemon" DROP CONSTRAINT "UserPokemon_pokemonId_fkey";

-- DropForeignKey
ALTER TABLE "UserPokemon" DROP CONSTRAINT "UserPokemon_userId_fkey";

-- DropIndex
DROP INDEX "UserPokemon_userId_pokemonId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "UserPokemon" DROP COLUMN "pokemonId",
DROP COLUMN "userId",
ADD COLUMN     "pokemon_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserPokemon_user_id_pokemon_id_key" ON "UserPokemon"("user_id", "pokemon_id");

-- AddForeignKey
ALTER TABLE "UserPokemon" ADD CONSTRAINT "UserPokemon_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPokemon" ADD CONSTRAINT "UserPokemon_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
