/*
  Warnings:

  - A unique constraint covering the columns `[sourceId]` on the table `PokemonCard` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sourceId` to the `PokemonCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PokemonCard" ADD COLUMN     "sourceId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PokemonCard_sourceId_key" ON "PokemonCard"("sourceId");
