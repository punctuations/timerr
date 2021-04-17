/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[dash]` on the table `Timer`. If there are existing duplicate values, the migration will fail.
  - Added the required column `dash` to the `Timer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Timer" ADD COLUMN     "dash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Timer.dash_unique" ON "Timer"("dash");
