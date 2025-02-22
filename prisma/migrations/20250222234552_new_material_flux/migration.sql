/*
  Warnings:

  - You are about to drop the column `materialId` on the `Reservation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_materialId_fkey";

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "materialId";

-- CreateTable
CREATE TABLE "ReservationMaterial" (
    "id" SERIAL NOT NULL,
    "reservationId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,

    CONSTRAINT "ReservationMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReservationMaterial_reservationId_materialId_key" ON "ReservationMaterial"("reservationId", "materialId");

-- AddForeignKey
ALTER TABLE "ReservationMaterial" ADD CONSTRAINT "ReservationMaterial_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationMaterial" ADD CONSTRAINT "ReservationMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;
