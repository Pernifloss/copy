import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';
import { IConnectionMessage } from './ConnectionMessage';
import { authMessageType } from './helpers/RoomHelpers';

@WebSocketGateway({ timeout: 10000 })
export class RoomGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private roomService: RoomService) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('RoomGateway');

  @SubscribeMessage('auth')
  handleConnectionMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: IConnectionMessage,
  ): void {
    this.logger.log(payload);

    if (this.roomService.isConnected(client)) {
      client.emit('auth', {
        success: false,
        reason: authMessageType.ALREADY_CONNECTED,
      });
      return;
    }

    if (!this.roomService.canConnect(payload)) {
      client.emit('auth', {
        success: false,
        reason: authMessageType.WRONG_ROOM_CODE,
      });
      return;
    }

    this.logger.log(
      `${client.id} has entered the room under the nickname "${payload.userName}"`,
    );

    this.roomService.addClient(
      client,
      payload.userName,
      payload.profilePictureRef,
    );
    client.emit('auth', { success: true, reason: '' });
    this.updateConnectedClients(client);
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket): void {
    client.emit('pong', {});
  }

  afterInit(Server: Server): void {
    this.logger.log('Room module Init');
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected from room: ${client.id}`);
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected to room: ${client.id}`);
  }

  updateConnectedClients(client: Socket): void {
    const connectedClients = this.roomService.getClients();
    const clientsData = connectedClients.map(c => c.toSocketData());

    connectedClients.forEach(c => {
      c.socket.emit('connections', { clients: clientsData });
    });
  }
}
