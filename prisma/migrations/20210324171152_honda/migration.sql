-- CreateTable
CREATE TABLE "Timer" (
    "id" SERIAL NOT NULL,
    "timerUUID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TEXT NOT NULL,
    "timeLeft" TEXT NOT NULL,
    "notify" BOOLEAN NOT NULL,
    "childLock" BOOLEAN NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Timer.timerUUID_unique" ON "Timer"("timerUUID");
