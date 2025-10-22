-- ensure pgvector is available
CREATE EXTENSION IF NOT EXISTS vector;

-- change embedding column to vector(1536)
ALTER TABLE "public"."Chunk"
  ALTER COLUMN embedding TYPE vector(1536)
  USING embedding::vector;

-- create HNSW index on the new dimension
CREATE INDEX IF NOT EXISTS chunk_embedding_hnsw
  ON "public"."Chunk" USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 200);