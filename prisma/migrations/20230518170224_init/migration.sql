-- CreateTable
CREATE TABLE "Starship" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "cost" TEXT,
    "length" TEXT,
    "crewSize" TEXT,
    "consumables" TEXT,
    "cargo" TEXT,
    "isUsed" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Person" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "height" TEXT,
    "gender" TEXT,
    "mass" TEXT,
    "isUsed" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "char1" INTEGER NOT NULL,
    "char2" INTEGER NOT NULL,
    "char3" INTEGER NOT NULL,
    "starship" INTEGER NOT NULL
);
