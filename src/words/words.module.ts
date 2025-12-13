import { Module } from "@nestjs/common";
import { WordPrismaModule } from "src/database";
import { wordsController } from "./words.controller";
import { WordService } from "./words.service";

@Module({
        "imports": [WordPrismaModule],
        "controllers": [wordsController],
        "providers": [WordService],
})
export class WordModule{};