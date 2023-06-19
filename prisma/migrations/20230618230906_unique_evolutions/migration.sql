/*
  Warnings:

  - A unique constraint covering the columns `[evolveFromId,evolveToId]` on the table `PokemonEvolution` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PokemonEvolution_evolveFromId_evolveToId_key" ON "PokemonEvolution"("evolveFromId", "evolveToId");
