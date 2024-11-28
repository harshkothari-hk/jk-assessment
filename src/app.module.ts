import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import dataSource from './ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from './modules/roles/role.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({...dataSource, logging: true}),
    RoleModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    console.log('Database connected successfully!');
  }
}
