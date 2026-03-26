/*
  Warnings:

  - You are about to drop the column `auditorium` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `seatRecliner` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `seatStandard` on the `movie` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "movie" DROP COLUMN "auditorium",
DROP COLUMN "seatRecliner",
DROP COLUMN "seatStandard",
ADD COLUMN     "publishedYear" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "cast" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ACTOR',
    "movieId" TEXT NOT NULL,

    CONSTRAINT "cast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "director" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'DIRECTOR',
    "movieId" TEXT NOT NULL,

    CONSTRAINT "director_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "producer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'producer',
    "movieId" TEXT NOT NULL,

    CONSTRAINT "producer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cast" ADD CONSTRAINT "cast_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "director" ADD CONSTRAINT "director_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producer" ADD CONSTRAINT "producer_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
