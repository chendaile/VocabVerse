import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { WordsModule } from './modules/words/words.module'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), WordsModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
