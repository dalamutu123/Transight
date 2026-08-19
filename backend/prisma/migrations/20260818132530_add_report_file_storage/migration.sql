-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "content_type" TEXT,
ADD COLUMN     "file_content" BYTEA,
ADD COLUMN     "file_name" TEXT;
