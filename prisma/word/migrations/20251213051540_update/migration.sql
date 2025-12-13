-- CreateTable
CREATE TABLE "stardict" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,
    "sw" TEXT NOT NULL,
    "phonetic" TEXT,
    "definition" TEXT,
    "translation" TEXT,
    "pos" TEXT,
    "collins" INTEGER DEFAULT 0,
    "oxford" INTEGER DEFAULT 0,
    "tag" TEXT,
    "bnc" INTEGER,
    "frq" INTEGER,
    "exchange" TEXT,
    "detail" TEXT,
    "audio" TEXT,

    CONSTRAINT "stardict_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stardict_word_key" ON "stardict"("word");

-- CreateIndex
CREATE INDEX "stardict_collins" ON "stardict"("collins");

-- CreateIndex
CREATE INDEX "stardict_oxford" ON "stardict"("oxford");

-- CreateIndex
CREATE INDEX "stardict_sw_word" ON "stardict"("sw", "word");

-- CreateIndex
CREATE INDEX "stardict_tag" ON "stardict"("tag");
