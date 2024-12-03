import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Documents } from './document.entity';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { S3Service } from 'src/common/service';
import { Users } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Documents, Users])],
  controllers: [DocumentController],
  providers: [DocumentService, S3Service],
})
export class DocumentModule {}
