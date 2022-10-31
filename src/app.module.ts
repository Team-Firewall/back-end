import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointModule } from './point/point.module';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { SignModule } from './sign/sign.module';
import { Regulate } from './entity/regulate.entity';
import { Parents } from './entity/parents.entity';
import { Point } from './entity/point.entity';
import { User } from './entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'hyun',
      database: 'typeorm',
      entities: [Point, User, Regulate, Parents],
      synchronize: true,
      autoLoadEntities: true,
    }),
    PointModule,
    UserModule,
    SignModule,
    AdminModule
  ],
})
export class AppModule {}
