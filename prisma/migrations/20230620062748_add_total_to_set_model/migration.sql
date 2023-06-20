/*
  Warnings:

  - Added the required column `total` to the `PokemonCardSet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PokemonCardSet" ADD COLUMN     "total" INTEGER NOT NULL;
