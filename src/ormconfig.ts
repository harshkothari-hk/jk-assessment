import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['dist/modules/*/*.js'],
    synchronize: true,
    logging: false,
};

console.log("dataSourceOptions",dataSourceOptions)
export default dataSourceOptions;

export const dataSource = new DataSource(dataSourceOptions);
