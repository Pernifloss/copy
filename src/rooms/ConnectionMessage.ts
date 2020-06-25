export interface IConnectionMessage {
  roomCode: string;
  userName: string;
  profilePictureRef: string;
  time: number;
}

export class ConnectionMessage implements IConnectionMessage {
  roomCode: string;
  userName: string;
  profilePictureRef: string;
  time: number;

  constructor(payload: IConnectionMessage) {
    this.roomCode = payload.roomCode;
    this.userName = payload.userName;
    this.profilePictureRef = payload.profilePictureRef;
    this.time = payload.time;
  }
}
