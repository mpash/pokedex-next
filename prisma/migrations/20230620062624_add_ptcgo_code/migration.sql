/*
  Warnings:

  - Added the required column `ptcgoCode` to the `PokemonCardSet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PokemonCardSet" ADD COLUMN     "ptcgoCode" TEXT NOT NULL;
