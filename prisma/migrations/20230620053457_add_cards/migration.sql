-- CreateTable
CREATE TABLE "PokemonCard" (
    "id" SERIAL NOT NULL,
    "data" JSONB NOT NULL,
    "imageSm" TEXT NOT NULL,
    "imageLg" TEXT NOT NULL,

    CONSTRAINT "PokemonCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PokemonToPokemonCard" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PokemonToPokemonCard_AB_unique" ON "_PokemonToPokemonCard"("A", "B");

-- CreateIndex
CREATE INDEX "_PokemonToPokemonCard_B_index" ON "_PokemonToPokemonCard"("B");

-- AddForeignKey
ALTER TABLE "_PokemonToPokemonCard" ADD CONSTRAINT "_PokemonToPokemonCard_A_fkey" FOREIGN KEY ("A") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonToPokemonCard" ADD CONSTRAINT "_PokemonToPokemonCard_B_fkey" FOREIGN KEY ("B") REFERENCES "PokemonCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
