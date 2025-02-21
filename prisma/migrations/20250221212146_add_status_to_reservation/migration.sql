/*
  Warnings:

  - Added the required column `dateEnd` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateStart` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Reservation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "StatusEnum" AS ENUM ('PENDENTE', 'EM_RESERVA', 'PARA_DEVOLVER', 'FINALIZADO', 'RECUSADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TypeEnum" AS ENUM ('COLETA', 'REUNIAO', 'MATERIAL', 'COLETA_MATERIAL', 'REUNIAO_MATERIAL');

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "dateEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dateStart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "materialId" INTEGER,
ADD COLUMN     "status" "StatusEnum" NOT NULL DEFAULT 'PENDENTE',
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "TypeEnum" NOT NULL;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE SET NULL ON UPDATE CASCADE;
