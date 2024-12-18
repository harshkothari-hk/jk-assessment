import * as dotenv from 'dotenv';
dotenv.config();

export const EnvConfig: any = {
  SERVER: {
    PORT: process.env.PORT,
  },
  DATABASE: {
    NAME: process.env.DB_NAME,
    USERNAME: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    HOST: process.env.DB_HOST,
    PORT: Number(process.env.DB_PORT),
    TYPE: process.env.DB_TYPE || 'mysql',
  },
  AWS: {
    ACCESS_KEY: process.env.AWS_ACCESS_KEY || '',
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
    REGION: process.env.AWS_REGION,
    BUCKET: process.env.AWS_BUCKET,
  },
};
