"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseConfig = void 0;
const config_1 = require("@nestjs/config");
exports.supabaseConfig = (0, config_1.registerAs)('supabase', () => ({
    url: process.env.SUPABASE_URL || '',
    key: process.env.SUPABASE_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    jwtSecret: process.env.SUPABASE_JWT_SECRET || '',
}));
//# sourceMappingURL=supabase.config.js.map