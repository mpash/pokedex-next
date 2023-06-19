/*
  Warnings:

  - You are about to drop the `PokemonEvolution` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PokemonEvolution" DROP CONSTRAINT "PokemonEvolution_evolveFromId_fkey";

-- DropForeignKey
ALTER TABLE "PokemonEvolution" DROP CONSTRAINT "PokemonEvolution_evolveToId_fkey";

-- DropTable
DROP TABLE "PokemonEvolution";

-- CreateTable
CREATE TABLE "_PokemonEvolutions" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PokemonEvolutions_AB_unique" ON "_PokemonEvolutions"("A", "B");

-- CreateIndex
CREATE INDEX "_PokemonEvolutions_B_index" ON "_PokemonEvolutions"("B");

-- AddForeignKey
ALTER TABLE "_PokemonEvolutions" ADD CONSTRAINT "_PokemonEvolutions_A_fkey" FOREIGN KEY ("A") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonEvolutions" ADD CONSTRAINT "_PokemonEvolutions_B_fkey" FOREIGN KEY ("B") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
