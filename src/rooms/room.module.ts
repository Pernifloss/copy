import { Module } from '@nestjs/common';
import { RoomGateway } from './room.gateway';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  controllers: [RoomController],
  providers: [RoomService, RoomGateway],
})
export class RoomModule {
}
