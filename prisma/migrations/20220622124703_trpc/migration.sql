/*
  Warnings:

  - You are about to drop the column `likes` on the `Contribution` table. All the data in the column will be lost.
  - You are about to drop the `LikedContribution` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LikedContribution" DROP CONSTRAINT "LikedContribution_blockId_fkey";

-- DropForeignKey
ALTER TABLE "LikedContribution" DROP CONSTRAINT "LikedContribution_contributionId_fkey";

-- DropForeignKey
ALTER TABLE "LikedContribution" DROP CONSTRAINT "LikedContribution_likerId_fkey";

-- DropForeignKey
ALTER TABLE "LikedContribution" DROP CONSTRAINT "LikedContribution_postId_fkey";

-- AlterTable
ALTER TABLE "Contribution" DROP COLUMN "likes";

-- DropTable
DROP TABLE "LikedContribution";

-- CreateTable
CREATE TABLE "Like" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "likerId" INTEGER NOT NULL,
    "contributionId" INTEGER NOT NULL,
    "blockId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_likerId_fkey" FOREIGN KEY ("likerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_contributionId_fkey" FOREIGN KEY ("contributionId") REFERENCES "Contribution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
