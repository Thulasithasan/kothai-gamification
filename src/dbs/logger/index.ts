import pino from 'pino';
import config from '@/config';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: config.pino.translateTime,
      ignore: 'pid, hostname',
    },
  },
});

export default logger;
