-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "stockSymbol" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "logoUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "StockPrice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "closePrice" REAL NOT NULL,
    CONSTRAINT "StockPrice_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SalesRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "volume" INTEGER NOT NULL,
    "periodType" TEXT NOT NULL,
    CONSTRAINT "SalesRecord_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_stockSymbol_key" ON "Company"("stockSymbol");

-- CreateIndex
CREATE UNIQUE INDEX "StockPrice_companyId_date_key" ON "StockPrice"("companyId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "SalesRecord_companyId_date_periodType_key" ON "SalesRecord"("companyId", "date", "periodType");
