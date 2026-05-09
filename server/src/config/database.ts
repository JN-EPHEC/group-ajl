import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url"; // Import requis pour recréer __dirname

// 1. Recréer __dirname et __filename pour le scope ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Charger le fichier .env à la racine du projet
// Remarque : Si votre fichier s'appelle ".env.production", remplacez ".env" par ".env.production" ci-dessous
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("La variable d'environnement DATABASE_URL n'est pas définie.");
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Requis pour Supabase
    },
  } as any,
});

export default sequelize;