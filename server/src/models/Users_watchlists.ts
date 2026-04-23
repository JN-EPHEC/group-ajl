import { DataTypes, Model} from 'sequelize';
import sequelize from '../config/database.js';

class User_watchlist extends Model {}

User_watchlist.init(
    {
        //attributs du modèle
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'User',
                key: 'user_id',
            }
        },
        film_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Film',
                key: 'film_id',
            }
        },
        date_ajout: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        //model options
        sequelize, //connection à l'instance
        modelName: 'User_watchlist', // nom du modèle
        tableName: 'Users_watchlists',
    },
);
export default User_watchlist;