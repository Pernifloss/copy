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
import { CustomNotification, NotificationType } from '../helpers/CustomNotification';

@WebSocketGateway({ timeout: 10000 })
export class RoomGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private roomService: RoomService) {
  }

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('RoomGateway');

  @SubscribeMessage('auth')
  handleConnectionMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: IConnectionMessage,
  ): void {
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

  @SubscribeMessage('launchRequest')
  handleLaunchRequest(@ConnectedSocket() client: Socket): void {
    setTimeout(() => {
      client.emit('launchRequest', {});
      this.updateLaunchedClients(client);
    }, 0);
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
    this.updateDisconnectedClients(client);
    this.roomService.removeClient(client);
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected to room: ${client.id}`);
  }

  updateConnectedClients(client: Socket): void {
    const connectedClient = this.roomService.getClient(client.id);
    const connectedClients = this.roomService.getClients();
    const clientsData = connectedClients.map(c => c.toSocketData());

    connectedClients.forEach(c => {
      c.socket.emit('connectedToRoom', { clients: clientsData });
      c.socket.emit('notification',
        new CustomNotification({
          header: connectedClient.userName,
          textContent: 'Joined the room !',
          type: NotificationType.INFO,
        }));
    });
  }

  updateLaunchedClients(client: Socket): void {
    const connectedClient = this.roomService.getClient(client.id);
    const connectedClients = this.roomService.getClients();
    const clientsData = connectedClients.map(c => c.toSocketData());

    connectedClients.forEach(c => {
      c.socket.emit('launchedIntoRoom', { clients: clientsData });
      c.socket.emit('notification',
        new CustomNotification({
          header: connectedClient.userName,
          textContent: 'Joined the Kube !',
          type: NotificationType.INFO,
        }));
    });
  }

  updateDisconnectedClients(client: Socket): void {
    const connectedClient = this.roomService.getClient(client.id);
    const connectedClients = this.roomService.getClients();

    connectedClients.forEach(c => {
      c.socket.emit('RemovedFromRoom', { client: connectedClient.toSocketData() });
      c.socket.emit('notification',
        new CustomNotification({
          header: connectedClient.userName,
          textContent: 'Left the Kube !',
          type: NotificationType.DANGER,
        }));
    });
  }
}
