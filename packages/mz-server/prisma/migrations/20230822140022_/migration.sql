-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_thumbnailId_fkey";

-- DropForeignKey
ALTER TABLE "ItemsTags" DROP CONSTRAINT "ItemsTags_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_itemId_fkey";

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_thumbnailId_fkey" FOREIGN KEY ("thumbnailId") REFERENCES "Thumbnail"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemsTags" ADD CONSTRAINT "ItemsTags_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
