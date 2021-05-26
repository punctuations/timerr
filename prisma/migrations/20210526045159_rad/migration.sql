/*
  Warnings:

  - Added the required column `rawTime` to the `Timer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rawUnits` to the `Timer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Timer" ADD COLUMN     "rawTime" INTEGER NOT NULL,
ADD COLUMN     "rawUnits" TEXT NOT NULL;
