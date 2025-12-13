import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    Query,
} from '@nestjs/common';
import { WordPrismaService } from '../database';
import { BatchWordsDto, SearchWordsDto } from './dto';

@Controller('words')
export class WordsController {
    constructor(private readonly prisma: WordPrismaService) {}

    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number) {
        const word = await this.prisma.stardict.findUnique({
            where: { id },
        });
        if (!word) {
            throw new NotFoundException('Word not found');
        }
        return word;
    }

    @Post('batch')
    async batch(@Body() body: BatchWordsDto) {
        if (!body.ids.length) {
            return [];
        }
        return this.prisma.stardict.findMany({
            where: {
                id: { in: body.ids },
            },
        });
    }

    @Get()
    async search(@Query() query: SearchWordsDto) {
        const limit = query.limit ?? 20;
        const filters: any[] = [];
        if (query.q) {
            filters.push({
                word: {
                    contains: query.q,
                    mode: 'insensitive',
                },
            });
        }
        if (query.tag) {
            filters.push({
                tag: {
                    contains: query.tag,
                },
            });
        }

        return this.prisma.stardict.findMany({
            where: filters.length ? { AND: filters } : undefined,
            orderBy: [
                { frq: 'desc' },
                { collins: 'desc' },
            ],
            take: limit,
        });
    }
}
