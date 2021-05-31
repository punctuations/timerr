/*
  Warnings:

  - Added the required column `pauseHour` to the `Timer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pauseMin` to the `Timer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pauseSec` to the `Timer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Timer" ADD COLUMN     "pauseHour" INTEGER NOT NULL,
ADD COLUMN     "pauseMin" INTEGER NOT NULL,
ADD COLUMN     "pauseSec" INTEGER NOT NULL;
