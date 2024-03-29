import { Client } from 'pg';
import { environment } from '../environment/environment';

export type DatabaseConnection = Client;

async function setupDatabase(db: DatabaseConnection) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS monday_tokens (
      token character varying(64) COLLATE pg_catalog."default" NOT NULL,
      monday_key character varying(400) COLLATE pg_catalog."default" NOT NULL,
      monday_board numeric(10,0) NOT NULL,
      CONSTRAINT monday_tokens_pkey PRIMARY KEY (token)
    )`);
}

export async function connectDatabase(): Promise<DatabaseConnection> {
  const connectionData = {
    user: environment.USER_DB,
    host: environment.HOST_DB,
    database: environment.NAME_DB,
    password: environment.PASSWORD_DB,
    port: Number(environment.PORT_DB),
    dialect: "postgres",
    ssl: false
  }
  const db = new Client(connectionData);
  try {
    await db.connect();
    await setupDatabase(db);
  } catch (error) {
    console.log("error", error);

  }

  return db;
}
