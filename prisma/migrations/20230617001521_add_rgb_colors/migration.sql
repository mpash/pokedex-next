-- CreateTable
CREATE TABLE "PrimaryColor" (
    "id" SERIAL NOT NULL,
    "r" INTEGER NOT NULL,
    "g" INTEGER NOT NULL,
    "b" INTEGER NOT NULL,
    "pokemonId" INTEGER NOT NULL,

    CONSTRAINT "PrimaryColor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PrimaryColor_pokemonId_key" ON "PrimaryColor"("pokemonId");

-- AddForeignKey
ALTER TABLE "PrimaryColor" ADD CONSTRAINT "PrimaryColor_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
