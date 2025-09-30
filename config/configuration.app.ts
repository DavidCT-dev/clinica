import { registerAs } from "@nestjs/config";

export default registerAs('config', () => ({
  port: parseInt(process.env.PORT ?? "4000", 10),
  database: {
    host: process.env.DATABASE_HOST,
    name: process.env.DATABASE_NAME,
  },
  jwt: { 
    secret: process.env.JWT_SECRET || 'fallback-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },

}));
