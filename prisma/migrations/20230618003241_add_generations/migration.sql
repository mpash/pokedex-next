-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "pokemonGenerationId" INTEGER;

-- CreateTable
CREATE TABLE "PokemonGeneration" (
    "id" SERIAL NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PokemonGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PokemonGeneration_sourceId_key" ON "PokemonGeneration"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonGeneration_name_key" ON "PokemonGeneration"("name");

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_pokemonGenerationId_fkey" FOREIGN KEY ("pokemonGenerationId") REFERENCES "PokemonGeneration"("id") ON DELETE SET NULL ON UPDATE CASCADE;
