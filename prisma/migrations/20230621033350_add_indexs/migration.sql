-- CreateIndex
CREATE INDEX "japanese_meta_name" ON "JapaneseMeta"("name");

-- CreateIndex
CREATE INDEX "pokemon_name" ON "Pokemon"("name");

-- CreateIndex
CREATE INDEX "pokemon_number" ON "Pokemon"("number");

-- CreateIndex
CREATE INDEX "pokemon_source_id" ON "Pokemon"("sourceId");

-- CreateIndex
CREATE INDEX "pokemon_slug" ON "Pokemon"("slug");

-- CreateIndex
CREATE INDEX "pokemon_ability" ON "PokemonAbility"("ability");

-- CreateIndex
CREATE INDEX "pokemon_type" ON "PokemonType"("type");

-- CreateIndex
CREATE INDEX "region_name" ON "Region"("name");
