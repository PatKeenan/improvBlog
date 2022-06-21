-- CreateTable
CREATE TABLE "LikedContribution" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "likerId" INTEGER NOT NULL,
    "contributionId" INTEGER NOT NULL,
    "blockId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "LikedContribution_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LikedContribution" ADD CONSTRAINT "LikedContribution_likerId_fkey" FOREIGN KEY ("likerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedContribution" ADD CONSTRAINT "LikedContribution_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedContribution" ADD CONSTRAINT "LikedContribution_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedContribution" ADD CONSTRAINT "LikedContribution_contributionId_fkey" FOREIGN KEY ("contributionId") REFERENCES "Contribution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
