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
import { FileTransferService } from './fileTransfer.service';

@WebSocketGateway({ timeout: 10000 })
export class FileTransferGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private fileTransferService: FileTransferService) {
  }

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  afterInit(Server: Server): void {
    this.logger.log('FileTransfer Init');
    this.fileTransferService.registerEvent(filename =>
      this.sendNewFile(filename),
    );
  }

  @SubscribeMessage('downloadPictures')
  handleMessage(@ConnectedSocket() client: Socket): void {
    client.emit('uploadedPictures', {
      pictures: this.fileTransferService.getCurrentFiles(),
    });
  }

  private sendNewFile(fileName: string): void {
    this.server.emit('uploadedSinglePicture', { fileName });
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected from fileTransfer: ${client.id}`);
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected to fileTransfer: ${client.id}`);
  }
}
