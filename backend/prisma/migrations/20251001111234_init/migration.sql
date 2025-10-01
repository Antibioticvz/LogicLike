-- CreateTable
CREATE TABLE "ideas" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "votes_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ideas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "votes" (
    "id" SERIAL NOT NULL,
    "idea_id" INTEGER NOT NULL,
    "ip_address" VARCHAR(45) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ideas_votes_count_idx" ON "ideas"("votes_count" DESC);

-- CreateIndex
CREATE INDEX "votes_ip_address_idx" ON "votes"("ip_address");

-- CreateIndex
CREATE INDEX "votes_idea_id_idx" ON "votes"("idea_id");

-- CreateIndex
CREATE UNIQUE INDEX "votes_idea_id_ip_address_key" ON "votes"("idea_id", "ip_address");

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_idea_id_fkey" FOREIGN KEY ("idea_id") REFERENCES "ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
