-- CreateTable
CREATE TABLE "Post" (
    "uuid" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorUuid" TEXT NOT NULL,

    PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "Post" ADD FOREIGN KEY("authorUuid")REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
