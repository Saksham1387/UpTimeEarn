-- DropForeignKey
ALTER TABLE "WebsiteTick" DROP CONSTRAINT "WebsiteTick_validatorId_fkey";

-- AlterTable
ALTER TABLE "WebsiteTick" ALTER COLUMN "validatorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "WebsiteTick" ADD CONSTRAINT "WebsiteTick_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "Validator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
