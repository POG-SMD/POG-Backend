/*
  Warnings:

  - Added the required column `endTime` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL;
