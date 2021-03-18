/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[timerUUID]` on the table `Timer`. If there are existing duplicate values, the migration will fail.
  - Added the required column `timerUUID` to the `Timer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Timer" ADD COLUMN     "timerUUID" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Timer.timerUUID_unique" ON "Timer"("timerUUID");
