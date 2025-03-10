"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtSecret = exports.getSupabaseKey = exports.getSupabaseUrl = exports.databaseConfig = void 0;
const dotenv = require("dotenv");
dotenv.config();
exports.databaseConfig = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV !== 'production',
    ssl: process.env.NODE_ENV === 'production',
    logging: process.env.NODE_ENV === 'development',
    autoLoadEntities: true,
};
const getSupabaseUrl = () => {
    return process.env.SUPABASE_URL || '';
};
exports.getSupabaseUrl = getSupabaseUrl;
const getSupabaseKey = () => {
    return process.env.SUPABASE_KEY || '';
};
exports.getSupabaseKey = getSupabaseKey;
const getJwtSecret = () => {
    return process.env.JWT_SECRET || 'supersecret';
};
exports.getJwtSecret = getJwtSecret;
//# sourceMappingURL=database.config.js.map