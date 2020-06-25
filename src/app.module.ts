import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { RoomModule } from './rooms/room.module';
import { FileTransferModule } from './file_transfer/fileTransfer.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ChatModule,
    RoomModule,
    MulterModule.register({
      dest: './files',
    }),
    FileTransferModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
}
