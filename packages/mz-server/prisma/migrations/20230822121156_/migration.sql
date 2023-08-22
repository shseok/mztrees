/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `RegionCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RegionCategory_name_key" ON "RegionCategory"("name");
