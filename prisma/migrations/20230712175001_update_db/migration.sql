-- DropIndex
DROP INDEX "PokemonCard_sourceId_key";

-- DropIndex
DROP INDEX "PokemonCardSet_sourceId_key";

-- AlterTable
ALTER TABLE "PokemonCard" ALTER COLUMN "sourceId" DROP NOT NULL,
ALTER COLUMN "data" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PokemonCardSet" ALTER COLUMN "sourceId" DROP NOT NULL;
