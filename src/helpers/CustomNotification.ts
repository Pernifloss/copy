export enum NotificationType {
  INFO = 0,
  WARN = 1,
  DANGER = 2
}

export interface ICustomNotification {
  header: string;
  textContent: string;
  type: NotificationType;
}

export class CustomNotification{
  header: string;
  textContent: string;
  type: number;

  constructor(payload: ICustomNotification) {
    this.header = payload.header;
    this.textContent = payload.textContent;
    this.type = payload.type;
  }
}