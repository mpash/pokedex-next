/*
  Warnings:

  - You are about to drop the column `accuracy` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `evasion` on the `Pokemon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pokemon" DROP COLUMN "accuracy",
DROP COLUMN "evasion";
