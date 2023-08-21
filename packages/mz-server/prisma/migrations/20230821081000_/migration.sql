/*
  Warnings:

  - Added the required column `ref` to the `Thumbnail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Thumbnail" ADD COLUMN     "ref" TEXT NOT NULL;
