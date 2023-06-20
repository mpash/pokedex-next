-- DropForeignKey
ALTER TABLE "PokemonCard" DROP CONSTRAINT "PokemonCard_pokemonCardSetId_fkey";

-- AlterTable
ALTER TABLE "PokemonCard" ALTER COLUMN "pokemonCardSetId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PokemonCard" ADD CONSTRAINT "PokemonCard_pokemonCardSetId_fkey" FOREIGN KEY ("pokemonCardSetId") REFERENCES "PokemonCardSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
