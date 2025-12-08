import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { WordsModule } from './modules/words/words.module'
import { AuthModule } from './modules/auth/auth.module'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), WordsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
