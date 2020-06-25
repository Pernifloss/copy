import { Module } from '@nestjs/common';
import { FileTransferController } from './fileTransfer.controller';
import { FileTransferService } from './fileTransfer.service';
import { FileTransferGateway } from './fileTransfer.gateway';

@Module({
  controllers: [FileTransferController],
  providers: [FileTransferService, FileTransferGateway],
})
export class FileTransferModule {
}
