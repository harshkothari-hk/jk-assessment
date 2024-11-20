import * as dotenv from 'dotenv';
dotenv.config();

export const EnvConfig = {
  SERVER: {
    PORT: process.env.PORT,
  },
  DATABASE: {
    NAME: process.env.DB_NAME,
    USERNAME: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    HOST: process.env.DB_HOST,
    PORT: process.env.DB_PORT,
  },
};
