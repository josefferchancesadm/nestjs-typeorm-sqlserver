import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User.entitie';
import { Profile } from './typeorm/entities/Profile.entitie';
import { Post } from './typeorm/entities/Post.entitie';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'ipservidor',
      port: 1433,
      username: 'nomesusuario',
      password: 'senhabanco',
      database: 'nomebanco',
      extra: {
        trustServerCertificate: true,
      },
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
      entities: [User, Profile, Post],
      synchronize: true,
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
