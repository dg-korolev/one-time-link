export interface ServerConfig {
  port: number;
  host: string;
}

export interface DbConfig {
  uri: string;
  logging: boolean;
}

export type AppConfig = {
  appName: string;
  server: ServerConfig;
  dbConfig: DbConfig;
};

export function loadConfiguration(): AppConfig {
  return {
    appName: 'one-time-link',
    server: {
      port: parseInt(process.env.PORT, 10) || 3000,
      host: process.env.HOST || '0.0.0.0',
    },
    dbConfig: {
      uri: process.env.DB_URI,
      logging: process.env.DB_LOGGING === 'true',
    },
  };
}
