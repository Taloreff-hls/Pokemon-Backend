/*
  Warnings:

  - Added the required column `height` to the `Pokemon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `Pokemon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "abilities" TEXT[],
ADD COLUMN     "height" TEXT NOT NULL,
ADD COLUMN     "weight" TEXT NOT NULL;
