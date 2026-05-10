import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });


class Database {
  private static instance: Sequelize;
  
  private constructor() {
  // Constructeur prive pour empecher l'instanciation directe avec 'new'
  }
  
  public static getInstance(): Sequelize {
    if (!Database.instance) {

      Database.instance = new Sequelize({
        username: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        database: "postgres",
        host: process.env.DB_HOST!,
        port: Number(process.env.DB_PORT!),
        dialect: "postgres",
        dialectOptions: {
          ssl: {
          require: true,
          rejectUnauthorized: false,
          },
        },
      logging: false,
    });
  }
    return Database.instance;
  }
}


export default Database.getInstance();