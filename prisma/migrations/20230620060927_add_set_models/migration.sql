/*
  Warnings:

  - Added the required column `artist` to the `PokemonCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `PokemonCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `PokemonCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pokemonCardSetId` to the `PokemonCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rarity` to the `PokemonCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PokemonCard" ADD COLUMN     "abilities" JSONB,
ADD COLUMN     "artist" TEXT NOT NULL,
ADD COLUMN     "attacks" JSONB,
ADD COLUMN     "convertedRetreatCost" INTEGER,
ADD COLUMN     "flavorText" TEXT,
ADD COLUMN     "hp" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "number" TEXT NOT NULL,
ADD COLUMN     "pokemonCardSetId" INTEGER NOT NULL,
ADD COLUMN     "pokemonCardSuperTypeId" INTEGER,
ADD COLUMN     "rarity" TEXT NOT NULL,
ADD COLUMN     "retreatCost" TEXT[],
ADD COLUMN     "rules" TEXT[],
ADD COLUMN     "types" TEXT[],
ADD COLUMN     "weaknesses" JSONB;

-- CreateTable
CREATE TABLE "PokemonCardSet" (
    "id" SERIAL NOT NULL,
    "sourceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "series" TEXT NOT NULL,
    "printedTotal" INTEGER NOT NULL,
    "legalities" JSONB NOT NULL,
    "releaseDate" TEXT NOT NULL,
    "symbolUrl" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,

    CONSTRAINT "PokemonCardSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonCardSetSuperType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PokemonCardSetSuperType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonCardSetSubType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PokemonCardSetSubType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PokemonCardToPokemonCardSetSubType" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PokemonCardSet_sourceId_key" ON "PokemonCardSet"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonCardSetSuperType_name_key" ON "PokemonCardSetSuperType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonCardSetSubType_name_key" ON "PokemonCardSetSubType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_PokemonCardToPokemonCardSetSubType_AB_unique" ON "_PokemonCardToPokemonCardSetSubType"("A", "B");

-- CreateIndex
CREATE INDEX "_PokemonCardToPokemonCardSetSubType_B_index" ON "_PokemonCardToPokemonCardSetSubType"("B");

-- AddForeignKey
ALTER TABLE "PokemonCard" ADD CONSTRAINT "PokemonCard_pokemonCardSetId_fkey" FOREIGN KEY ("pokemonCardSetId") REFERENCES "PokemonCardSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonCard" ADD CONSTRAINT "PokemonCard_pokemonCardSuperTypeId_fkey" FOREIGN KEY ("pokemonCardSuperTypeId") REFERENCES "PokemonCardSetSuperType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonCardToPokemonCardSetSubType" ADD CONSTRAINT "_PokemonCardToPokemonCardSetSubType_A_fkey" FOREIGN KEY ("A") REFERENCES "PokemonCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonCardToPokemonCardSetSubType" ADD CONSTRAINT "_PokemonCardToPokemonCardSetSubType_B_fkey" FOREIGN KEY ("B") REFERENCES "PokemonCardSetSubType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
