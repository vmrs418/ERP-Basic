import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './supabase/supabase.module';
import { HealthModule } from './health/health.module';
import { DepartmentsModule } from './departments/departments.module';
import { PayrollModule } from './payroll/payroll.module';
// import { EmployeesModule } from './employees/employees.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Temporarily comment out TypeORM to simplify startup
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => {
    //     const isDev = configService.get('NODE_ENV') !== 'production';
    //     return {
    //       type: 'postgres',
    //       host: configService.get('DB_HOST'),
    //       port: configService.get('DB_PORT'),
    //       username: configService.get('DB_USERNAME'),
    //       password: configService.get('DB_PASSWORD'),
    //       database: configService.get('DB_DATABASE'),
    //       autoLoadEntities: true,
    //       synchronize: isDev,
    //       ssl: true,
    //       extra: {
    //         ssl: {
    //           rejectUnauthorized: false
    //         }
    //       },
    //     }
    //   },
    // }),
    AuthModule,
    SupabaseModule,
    HealthModule,
    DepartmentsModule,
    PayrollModule,
    // EmployeesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {} 