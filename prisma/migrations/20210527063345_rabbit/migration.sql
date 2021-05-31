/*
  Warnings:

  - You are about to drop the column `pauseHour` on the `Timer` table. All the data in the column will be lost.
  - You are about to drop the column `pauseMin` on the `Timer` table. All the data in the column will be lost.
  - You are about to drop the column `pauseSec` on the `Timer` table. All the data in the column will be lost.
  - Added the required column `pauseMilli` to the `Timer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Timer" DROP COLUMN "pauseHour",
DROP COLUMN "pauseMin",
DROP COLUMN "pauseSec",
ADD COLUMN     "pauseMilli" INTEGER NOT NULL;
