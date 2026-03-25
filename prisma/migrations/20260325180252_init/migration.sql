-- CreateTable
CREATE TABLE "movie" (
    "id" TEXT NOT NULL,
    "movieName" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'normal',
    "categories" TEXT[],
    "poster" TEXT,
    "trailerUrl" TEXT,
    "videoUrl" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL,
    "story" TEXT,
    "auditorium" TEXT NOT NULL DEFAULT 'COMPLEX 1',
    "seatStandard" INTEGER NOT NULL,
    "seatRecliner" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_movie_type" ON "movie"("type");
