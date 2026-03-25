import { Sequelize } from "sequelize";
const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: "postgres",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
        logging: false,
    })
    : new Sequelize({
        username: "postgres",
        password: "8Pg.A91Y3u72",
        database: "postgres",
        host: "db.ofsczgyfksxagrclufmc.supabase.co",
        port: Number(5432),
        dialect: "postgres",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
        logging: false,
    });
//# sourceMappingURL=database.js.map