import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import { createPool, Pool } from "mysql2/promise";
import { env } from "src/env";
export class MysqlConnection {
  private static instance: MysqlConnection;
  private db: MySql2Database | undefined;
  private pool: Pool | undefined;

  private constructor() {}

  private async connect() {
    try {
      const poolConnection: Pool = createPool({
        host: env().MYSQL_HOST,
        user: env().MYSQL_USER,
        password: env().MYSQL_PASSWORD,
        database: env().MYSQL_DATABASE,
      });

      this.db = drizzle(poolConnection);
      this.pool = poolConnection;
    } catch (e) {}
  }

  static async connect(): Promise<MySql2Database> {
    if (!MysqlConnection.instance) {
      MysqlConnection.instance = new MysqlConnection();
      await MysqlConnection.instance.connect();
      console.log("MYSQL DB Connected");
    }
    return MysqlConnection.instance.db!;
  }

  static getDbInstance() {
    if (!MysqlConnection.instance || !MysqlConnection.instance.db) {
      throw new Error(
        "❌ Mysql has not been connected yet! Please connect it first."
      );
    }
    return MysqlConnection.instance.db;
  }

  static getPoolConnection() {
    if (!MysqlConnection.instance || !MysqlConnection.instance.pool) {
      throw new Error(
        "❌ Mysql has not been connected yet! Please connect it first."
      );
    }
    return MysqlConnection.instance.pool;
  }
}
