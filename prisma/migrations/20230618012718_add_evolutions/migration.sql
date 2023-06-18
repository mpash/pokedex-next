-- CreateTable
CREATE TABLE "PokemonEvolution" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "evolveFromId" INTEGER NOT NULL,
    "evolveToId" INTEGER NOT NULL,

    CONSTRAINT "PokemonEvolution_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PokemonEvolution" ADD CONSTRAINT "PokemonEvolution_evolveFromId_fkey" FOREIGN KEY ("evolveFromId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonEvolution" ADD CONSTRAINT "PokemonEvolution_evolveToId_fkey" FOREIGN KEY ("evolveToId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
