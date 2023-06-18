/*
  Warnings:

  - You are about to drop the column `pokemonGenerationId` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the `PokemonGeneration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pokemon" DROP CONSTRAINT "Pokemon_pokemonGenerationId_fkey";

-- AlterTable
ALTER TABLE "Pokemon" DROP COLUMN "pokemonGenerationId",
ADD COLUMN     "regionId" INTEGER;

-- DropTable
DROP TABLE "PokemonGeneration";

-- CreateTable
CREATE TABLE "Region" (
    "id" SERIAL NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Region_sourceId_key" ON "Region"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Region_name_key" ON "Region"("name");

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;
