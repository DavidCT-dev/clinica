import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import configurationApp from 'config/configuration.app';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionModule } from './permission/permission.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `env/.env.${process.env.NODE_ENV}`, 
      load: [configurationApp],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('config.database.host');
        const dbName = configService.get<string>('config.database.name');
        return {
          uri: `mongodb${host}/${dbName}`,
        };
      },
    }),
     JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('config.jwt.secret') || 'fallback-secret-key',
        signOptions: {
          expiresIn: configService.get<string>('config.jwt.expiresIn') || '1h'
        },
      }),
      global: true,
    }),
    UserModule,
    AuthModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
