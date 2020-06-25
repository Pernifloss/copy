import { Socket } from 'socket.io';

export interface IClientData {
  userName : string;
  profilePictureRef : string;
  socketId : string;
}

export class Client {
  socket: Socket;
  userName: string;
  profilePictureRef: string;

  constructor(socket: Socket, userName: string, profilePictureRef: string) {
    this.socket = socket;
    this.userName = userName;
    this.profilePictureRef = profilePictureRef;
  }

  public toSocketData = () : IClientData => {
    return {
      userName : this.userName,
      profilePictureRef: this.profilePictureRef,
      socketId : this.socket.id
    }
  }
}
