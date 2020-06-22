import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { RoomModule } from './rooms/room.module';

@Module({
  imports: [
    ChatModule,
    RoomModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
}
