import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorResponse } from 'src/common/dto';
import { BaseService, S3Service } from '../../common/service';
import { RequestQuery } from 'src/common/dto/base-service.dto';
import { paginate } from 'nestjs-typeorm-paginate';
import { Documents } from './document.entity';
import { DocumentDTO, DocumentFilterDTO } from './document.dto';

@Injectable()
export class DocumentService extends BaseService {
  constructor(
    @InjectRepository(Documents)
    private readonly documentRepo: Repository<Documents>,
    private s3Service: S3Service,
  ) {
    super();
  }

  public async addDocument(file: any, payload: DocumentDTO) {
    const key = `user-document/${payload.user}/${Date.now()}.jpg`;
    await this.s3Service.uploadFile(file, key);
    const documentResponse = await this.documentRepo.save({
      key,
      documentName: payload.documentName,
      user: payload.user,
    });
    return documentResponse;
  }

  public async deleteDocument(id: string) {
    const updateResponse = await this.documentRepo.update(
      { id: id },
      {
        isDeleted: true,
      },
    );
    return updateResponse;
  }

  public async getAllDocuments(query: RequestQuery<DocumentFilterDTO>) {
    const { filter, pagination, sort } = this.getQuery(query);
    const documentsQB = this.documentRepo.
    createQueryBuilder('documents')
    .select('documents.id')
    .addSelect('documents.documentName')
    .addSelect('documents.key')
    .addSelect('users.id')
    .addSelect('users.firstName')
    .addSelect('users.lastName')
    .leftJoin('documents.user', 'users')

    if (filter.documentName) {
      documentsQB.andWhere('documents.documentName ILIKE :documentName', {
        documentName: `%${filter.documentName}%`,
      });
    }

    if (filter.userId) {
      documentsQB.andWhere('users.id = :userId', {
        userId: filter.userId,
      });
    }

    if (sort.documentName) {
      documentsQB.orderBy('documents.documentName', sort.documentName.toUpperCase());
    }
    
    return paginate(documentsQB, pagination);
  }
}
