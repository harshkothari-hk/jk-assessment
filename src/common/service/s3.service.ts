import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';
import { EnvConfig } from '../../environment/index';
import { ErrorResponse } from '../dto';
import { HttpStatus } from '@nestjs/common';

const client = new S3Client({
  region: EnvConfig.AWS.REGION,
  credentials: {
    accessKeyId: EnvConfig.AWS.ACCESS_KEY,
    secretAccessKey: EnvConfig.AWS.SECRET_ACCESS_KEY,
  },
});

export class S3Service {
  async uploadFile(files: any, key: string) {
    const params = {
      Bucket: EnvConfig.AWS.BUCKET,
      Key: key,
      Body: files.buffer,
      ContentType: files.mimetype,
    };

    const uploadCommand = new PutObjectCommand(params);
    return client.send(uploadCommand).catch((error) => {
      console.log('error', error);
      throw new ErrorResponse(
        HttpStatus.BAD_REQUEST,
        'Error Uploading file to S3',
      );
    });
  }
}
