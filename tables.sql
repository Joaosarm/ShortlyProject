CREATE TABLE "users"(
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
)

CREATE TABLE "sessions"(
    "id" SERIAL PRIMARY KEY,
    "userId" INT NOT NULL REFERENCES "users"("id"),
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()    
)

CREATE TABLE "shortenedUrls"(
    "id" SERIAL PRIMARY KEY,
    "userId" INT NOT NULL REFERENCES "users"("id"),
    "url" TEXT NOT NULL,
    "shortUrl" TEXT NOT NULL,
    "visitCount" INT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
)