import { Injectable } from '@nestjs/common';
import { Client } from './Client';
import { Socket } from 'socket.io';
import { generateRoomCode } from './helpers/RoomHelpers';
import { IConnectionMessage } from './ConnectionMessage';

@Injectable()
export class RoomService {
  clients: Client[] = [];
  roomCode: string = generateRoomCode();

  canConnect(connectionMessage: IConnectionMessage): boolean {
    return this.roomCode === connectionMessage.roomCode;
  }

  getClients(): Client[] {
    return this.clients;
  }

  getClient(id: string): Client {
    return this.clients.find(u => u.socket.id === id);
  }

  addClient(socket, userName: string, profilePictureRef: string): void {
    this.clients.push(new Client(socket, userName, profilePictureRef));
  }

  removeClient(client: Socket): void {
    const clientIndex = this.clients.findIndex(c => c.socket.id === client.id);
    if (clientIndex >= 0) this.clients.splice(clientIndex, 1);
  }

  isConnected(client: Socket): boolean {
    return !!this.getClient(client.id);
  }
}
