/*
  Warnings:

  - Added the required column `type` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "type" INTEGER NOT NULL;
