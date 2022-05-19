/*
  Warnings:

  - You are about to drop the column `votes` on the `Contribution` table. All the data in the column will be lost.
  - You are about to drop the column `about` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the `PrivatePostMember` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `plot` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PrivatePostMember" DROP CONSTRAINT "PrivatePostMember_postId_fkey";

-- DropForeignKey
ALTER TABLE "PrivatePostMember" DROP CONSTRAINT "PrivatePostMember_userId_fkey";

-- AlterTable
ALTER TABLE "Contribution" DROP COLUMN "votes",
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "about",
ADD COLUMN     "plot" TEXT NOT NULL,
ADD COLUMN     "privateMemberIds" INTEGER[];

-- DropTable
DROP TABLE "PrivatePostMember";
