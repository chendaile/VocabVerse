import { Body, Controller } from '@nestjs/common';
import { WordPrismaService } from 'src/database';
import { Get, Post } from '@nestjs/common';

@Controller('words')
export class wordsController {
        constructor(private readonly prisma: WordPrismaService) {};

        @Post("tar2wordids")
        async Tar2wordIds(@Body() body: {level: string, })

}
