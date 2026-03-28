/*
  Warnings:

  - A unique constraint covering the columns `[movieId]` on the table `booking` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[movieId]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "movie" ALTER COLUMN "price" DROP NOT NULL,
ALTER COLUMN "price" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "booking_movieId_key" ON "booking"("movieId");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_movieId_key" ON "reviews"("movieId");
