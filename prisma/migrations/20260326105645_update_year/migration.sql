/*
  Warnings:

  - The `publishedYear` column on the `movie` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "movie" DROP COLUMN "publishedYear",
ADD COLUMN     "publishedYear" INTEGER NOT NULL DEFAULT 2026;
