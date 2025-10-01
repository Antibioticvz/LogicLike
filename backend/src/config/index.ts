import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  host: string;
  nodeEnv: string;
  databaseUrl: string;
  corsOrigin: string;
  rateLimit: {
    max: number;
    timeWindow: number;
  };
  voting: {
    maxVotesPerIp: number;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    timeWindow: parseInt(process.env.RATE_LIMIT_TIME_WINDOW || '60000', 10),
  },
  voting: {
    maxVotesPerIp: 10,
  },
};

export default config;
