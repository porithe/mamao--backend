-- CreateTable
CREATE TABLE "User" (
    "uuid" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "description" TEXT,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Follows" (
    "followerUuid" TEXT NOT NULL,
    "followingUuid" TEXT NOT NULL,

    PRIMARY KEY ("followerUuid","followingUuid")
);

-- CreateTable
CREATE TABLE "Post" (
    "uuid" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorUuid" TEXT NOT NULL,

    PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Comment" (
    "uuid" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "postUuid" TEXT NOT NULL,
    "userUuid" TEXT NOT NULL,

    PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.username_unique" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Follows" ADD FOREIGN KEY("followerUuid")REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD FOREIGN KEY("followingUuid")REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD FOREIGN KEY("authorUuid")REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD FOREIGN KEY("postUuid")REFERENCES "Post"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD FOREIGN KEY("userUuid")REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
