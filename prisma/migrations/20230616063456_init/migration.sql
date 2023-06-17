-- CreateTable
CREATE TABLE "Pokemon" (
    "id" SERIAL NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" INTEGER NOT NULL,
    "hp" INTEGER,
    "attack" INTEGER,
    "defense" INTEGER,
    "spAttack" INTEGER,
    "spDefense" INTEGER,
    "speed" INTEGER,
    "accuracy" INTEGER,
    "evasion" INTEGER,
    "image" TEXT NOT NULL,
    "descriptionX" TEXT NOT NULL,
    "descriptionY" TEXT NOT NULL,
    "detailPageURL" TEXT NOT NULL,
    "collectiblesSlug" TEXT NOT NULL,
    "thumbnailAltText" TEXT NOT NULL,
    "thumbnailImage" TEXT NOT NULL,
    "subVariant" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonType" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PokemonType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonAbility" (
    "id" SERIAL NOT NULL,
    "ability" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PokemonAbility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JapaneseData" (
    "id" SERIAL NOT NULL,
    "kyodai_flg" INTEGER NOT NULL,
    "image_s" TEXT NOT NULL,
    "sub_name" TEXT NOT NULL,
    "sub" INTEGER NOT NULL,
    "type_2" INTEGER NOT NULL,
    "image_m" TEXT NOT NULL,
    "no" TEXT NOT NULL,
    "type_1" INTEGER NOT NULL,
    "takasa" TEXT NOT NULL,
    "zukan_no" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "omosa" TEXT NOT NULL,
    "pokemonId" INTEGER NOT NULL,

    CONSTRAINT "JapaneseData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PokemonToPokemonType" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PokemonWeaknesses" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PokemonToPokemonAbility" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PokemonType_type_key" ON "PokemonType"("type");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonAbility_ability_key" ON "PokemonAbility"("ability");

-- CreateIndex
CREATE UNIQUE INDEX "JapaneseData_pokemonId_key" ON "JapaneseData"("pokemonId");

-- CreateIndex
CREATE UNIQUE INDEX "_PokemonToPokemonType_AB_unique" ON "_PokemonToPokemonType"("A", "B");

-- CreateIndex
CREATE INDEX "_PokemonToPokemonType_B_index" ON "_PokemonToPokemonType"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PokemonWeaknesses_AB_unique" ON "_PokemonWeaknesses"("A", "B");

-- CreateIndex
CREATE INDEX "_PokemonWeaknesses_B_index" ON "_PokemonWeaknesses"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PokemonToPokemonAbility_AB_unique" ON "_PokemonToPokemonAbility"("A", "B");

-- CreateIndex
CREATE INDEX "_PokemonToPokemonAbility_B_index" ON "_PokemonToPokemonAbility"("B");

-- AddForeignKey
ALTER TABLE "JapaneseData" ADD CONSTRAINT "JapaneseData_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonToPokemonType" ADD CONSTRAINT "_PokemonToPokemonType_A_fkey" FOREIGN KEY ("A") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonToPokemonType" ADD CONSTRAINT "_PokemonToPokemonType_B_fkey" FOREIGN KEY ("B") REFERENCES "PokemonType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonWeaknesses" ADD CONSTRAINT "_PokemonWeaknesses_A_fkey" FOREIGN KEY ("A") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonWeaknesses" ADD CONSTRAINT "_PokemonWeaknesses_B_fkey" FOREIGN KEY ("B") REFERENCES "PokemonType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonToPokemonAbility" ADD CONSTRAINT "_PokemonToPokemonAbility_A_fkey" FOREIGN KEY ("A") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonToPokemonAbility" ADD CONSTRAINT "_PokemonToPokemonAbility_B_fkey" FOREIGN KEY ("B") REFERENCES "PokemonAbility"("id") ON DELETE CASCADE ON UPDATE CASCADE;
