-- DropIndex
DROP INDEX "Category_name_key";

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "metaDescription" TEXT;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "metaDescription" TEXT;
