import 'dotenv/config';
const config = {
  env: process.env.ENV || 'dev',
  secret: process.env.SECRET || '',
  pino: {
    translateTime:
      process.env.PINO_TRANSLATE_TIME_FORMAT ||
      'SYS:dd-mm-yyyy HH:mm:ss',
  },
  mongo: {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017',
    db: process.env.MONGO_DB_NAME || 'base',
  },
  base: '/api',
  admin: 'admin',
  route: {
    user: 'user',
    role: 'role',
    auth: 'auth',
  },
};

export default config;
