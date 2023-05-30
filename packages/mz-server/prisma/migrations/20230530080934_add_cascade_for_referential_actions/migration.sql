-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "subcommentsCount" INTEGER NOT NULL DEFAULT 0,
    "parentCommentId" INTEGER,
    "mentionUserId" INTEGER,
    "itemId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Comment_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comment_mentionUserId_fkey" FOREIGN KEY ("mentionUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("createdAt", "deletedAt", "id", "itemId", "likes", "mentionUserId", "parentCommentId", "subcommentsCount", "text", "updatedAt", "userId") SELECT "createdAt", "deletedAt", "id", "itemId", "likes", "mentionUserId", "parentCommentId", "subcommentsCount", "text", "updatedAt", "userId" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
CREATE INDEX "Comment_deletedAt_idx" ON "Comment"("deletedAt");
CREATE INDEX "Comment_createdAt_idx" ON "Comment"("createdAt");
CREATE INDEX "Comment_parentCommentId_idx" ON "Comment"("parentCommentId");
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "author" TEXT NOT NULL DEFAULT '',
    "link" TEXT,
    "thumbnail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    "publisherId" INTEGER NOT NULL,
    CONSTRAINT "Item_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("author", "body", "createdAt", "id", "link", "publisherId", "thumbnail", "title", "updatedAt", "userId") SELECT "author", "body", "createdAt", "id", "link", "publisherId", "thumbnail", "title", "updatedAt", "userId" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE INDEX "Item_createdAt_idx" ON "Item"("createdAt" DESC);
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
