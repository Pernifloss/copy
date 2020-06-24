import { Injectable } from '@nestjs/common';
import { NewFileEvent } from './helpers/fileTransferHelpers';

@Injectable()
export class FileTransferService {
  private currentFiles: string[] = [];
  private newFileEvents : NewFileEvent[] = [];

  addNewFile(filename: string) : void{
    this.currentFiles.push(filename);

    this.newFileEvents.forEach(event => event(filename));
  }

  getCurrentFiles() : string[]{
    return this.currentFiles;
  }

  registerEvent(event: NewFileEvent) : void{
    this.newFileEvents.push(event);
  }
}