/*
  Warnings:

  - You are about to drop the column `description` on the `Document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Document" DROP COLUMN "description",
ADD COLUMN     "metadata" TEXT;

-- CreateIndex
CREATE INDEX "Chunk_documentId_idx" ON "public"."Chunk"("documentId");

-- CreateIndex
CREATE INDEX "Chunk_embedding_idx" ON "public"."Chunk"("embedding");

-- CreateIndex
CREATE INDEX "Document_userId_idx" ON "public"."Document"("userId");
