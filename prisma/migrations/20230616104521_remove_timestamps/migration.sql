/*
  Warnings:

  - You are about to drop the column `createdAt` on the `PokemonAbility` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `PokemonAbility` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `PokemonType` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `PokemonType` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PokemonAbility" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "PokemonType" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";
