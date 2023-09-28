import type { SupportedNetwork } from './types';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      POSTGRES_DB: string;
      POSTGRES_USER: string;
      POSTGRES_HOST: string;
      POSTGRES_PORT: number;
      POSTGRES_PASSWORD: string;
      INFURA_API_KEY: string;
      NETWORK: SupportedNetwork;
      REDIS_CONNECTION_STRING: string;
    }
  }
}

export {};
