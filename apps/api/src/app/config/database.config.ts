import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production', // Automatic synchronization should be disabled in production
  ssl: process.env.NODE_ENV === 'production',
  logging: process.env.NODE_ENV === 'development',
  autoLoadEntities: true,
};

export const getSupabaseUrl = (): string => {
  return process.env.SUPABASE_URL || '';
};

export const getSupabaseKey = (): string => {
  return process.env.SUPABASE_KEY || '';
};

export const getJwtSecret = (): string => {
  return process.env.JWT_SECRET || 'supersecret'; // Should be overridden in production
}; 