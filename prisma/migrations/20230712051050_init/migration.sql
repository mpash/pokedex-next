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
    "image" TEXT NOT NULL,
    "descriptionX" TEXT NOT NULL,
    "descriptionY" TEXT NOT NULL,
    "detailPageURL" TEXT NOT NULL,
    "collectiblesSlug" TEXT NOT NULL,
    "thumbnailAltText" TEXT NOT NULL,
    "thumbnailImage" TEXT NOT NULL,
    "subVariant" INTEGER NOT NULL,
    "evolutionChain" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "regionId" INTEGER,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonType" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "PokemonType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonAbility" (
    "id" SERIAL NOT NULL,
    "ability" TEXT NOT NULL,

    CONSTRAINT "PokemonAbility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JapaneseMeta" (
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

    CONSTRAINT "JapaneseMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrimaryColor" (
    "id" SERIAL NOT NULL,
    "r" INTEGER NOT NULL,
    "g" INTEGER NOT NULL,
    "b" INTEGER NOT NULL,
    "pokemonId" INTEGER NOT NULL,

    CONSTRAINT "PrimaryColor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" SERIAL NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonCard" (
    "id" SERIAL NOT NULL,
    "sourceId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "imageSm" TEXT NOT NULL,
    "imageLg" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rules" TEXT[],
    "hp" TEXT,
    "types" TEXT[],
    "abilities" JSONB,
    "attacks" JSONB,
    "weaknesses" JSONB,
    "retreatCost" TEXT[],
    "convertedRetreatCost" INTEGER,
    "flavorText" TEXT,
    "rarity" TEXT,
    "artist" TEXT,
    "number" TEXT NOT NULL,
    "pokemonCardSetId" INTEGER,
    "pokemonCardSuperTypeId" INTEGER,

    CONSTRAINT "PokemonCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonCardSet" (
    "id" SERIAL NOT NULL,
    "sourceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "series" TEXT NOT NULL,
    "printedTotal" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "legalities" JSONB NOT NULL,
    "ptcgoCode" TEXT,
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

-- CreateTable
CREATE TABLE "_PokemonEvolutions" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PokemonToPokemonCard" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PokemonCardToPokemonCardSetSubType" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "pokemon_name" ON "Pokemon"("name");

-- CreateIndex
CREATE INDEX "pokemon_number" ON "Pokemon"("number");

-- CreateIndex
CREATE INDEX "pokemon_source_id" ON "Pokemon"("sourceId");

-- CreateIndex
CREATE INDEX "pokemon_slug" ON "Pokemon"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonType_type_key" ON "PokemonType"("type");

-- CreateIndex
CREATE INDEX "pokemon_type" ON "PokemonType"("type");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonAbility_ability_key" ON "PokemonAbility"("ability");

-- CreateIndex
CREATE INDEX "pokemon_ability" ON "PokemonAbility"("ability");

-- CreateIndex
CREATE UNIQUE INDEX "JapaneseMeta_pokemonId_key" ON "JapaneseMeta"("pokemonId");

-- CreateIndex
CREATE INDEX "japanese_meta_name" ON "JapaneseMeta"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PrimaryColor_pokemonId_key" ON "PrimaryColor"("pokemonId");

-- CreateIndex
CREATE UNIQUE INDEX "Region_sourceId_key" ON "Region"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Region_name_key" ON "Region"("name");

-- CreateIndex
CREATE INDEX "region_name" ON "Region"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonCard_sourceId_key" ON "PokemonCard"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonCardSet_sourceId_key" ON "PokemonCardSet"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonCardSetSuperType_name_key" ON "PokemonCardSetSuperType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonCardSetSubType_name_key" ON "PokemonCardSetSubType"("name");

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

-- CreateIndex
CREATE UNIQUE INDEX "_PokemonEvolutions_AB_unique" ON "_PokemonEvolutions"("A", "B");

-- CreateIndex
CREATE INDEX "_PokemonEvolutions_B_index" ON "_PokemonEvolutions"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PokemonToPokemonCard_AB_unique" ON "_PokemonToPokemonCard"("A", "B");

-- CreateIndex
CREATE INDEX "_PokemonToPokemonCard_B_index" ON "_PokemonToPokemonCard"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PokemonCardToPokemonCardSetSubType_AB_unique" ON "_PokemonCardToPokemonCardSetSubType"("A", "B");

-- CreateIndex
CREATE INDEX "_PokemonCardToPokemonCardSetSubType_B_index" ON "_PokemonCardToPokemonCardSetSubType"("B");

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JapaneseMeta" ADD CONSTRAINT "JapaneseMeta_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrimaryColor" ADD CONSTRAINT "PrimaryColor_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonCard" ADD CONSTRAINT "PokemonCard_pokemonCardSetId_fkey" FOREIGN KEY ("pokemonCardSetId") REFERENCES "PokemonCardSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonCard" ADD CONSTRAINT "PokemonCard_pokemonCardSuperTypeId_fkey" FOREIGN KEY ("pokemonCardSuperTypeId") REFERENCES "PokemonCardSetSuperType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "_PokemonEvolutions" ADD CONSTRAINT "_PokemonEvolutions_A_fkey" FOREIGN KEY ("A") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonEvolutions" ADD CONSTRAINT "_PokemonEvolutions_B_fkey" FOREIGN KEY ("B") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonToPokemonCard" ADD CONSTRAINT "_PokemonToPokemonCard_A_fkey" FOREIGN KEY ("A") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonToPokemonCard" ADD CONSTRAINT "_PokemonToPokemonCard_B_fkey" FOREIGN KEY ("B") REFERENCES "PokemonCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonCardToPokemonCardSetSubType" ADD CONSTRAINT "_PokemonCardToPokemonCardSetSubType_A_fkey" FOREIGN KEY ("A") REFERENCES "PokemonCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonCardToPokemonCardSetSubType" ADD CONSTRAINT "_PokemonCardToPokemonCardSetSubType_B_fkey" FOREIGN KEY ("B") REFERENCES "PokemonCardSetSubType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
