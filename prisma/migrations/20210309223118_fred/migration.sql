-- CreateTable
CREATE TABLE "Timer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "timeLeft" INTEGER NOT NULL,
    "notify" BOOLEAN NOT NULL,
    "childLock" BOOLEAN NOT NULL,

    PRIMARY KEY ("id")
);
