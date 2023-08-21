/*
  Warnings:

  - Made the column `key` on table `Thumbnail` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Thumbnail" ALTER COLUMN "key" SET NOT NULL;
