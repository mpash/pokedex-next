/*
  Warnings:

  - You are about to drop the `JapaneseData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "JapaneseData" DROP CONSTRAINT "JapaneseData_pokemonId_fkey";

-- DropTable
DROP TABLE "JapaneseData";

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

-- CreateIndex
CREATE UNIQUE INDEX "JapaneseMeta_pokemonId_key" ON "JapaneseMeta"("pokemonId");

-- AddForeignKey
ALTER TABLE "JapaneseMeta" ADD CONSTRAINT "JapaneseMeta_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
