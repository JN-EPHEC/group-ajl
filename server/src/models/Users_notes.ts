import { DataTypes, Model} from 'sequelize';
import sequelize from '../config/database.js';

class User_note extends Model {}

User_note.init(
    {
        //attributs du modèle
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Users',
                key: 'user_id',
            }
        },
        film_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Films',
                key: 'film_id',
            }
        },
        note: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        commentaire: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        //model options
        sequelize, //connection à l'instance
        modelName: 'Users_notes', // nom du modèle
        tableName: 'Users_notes',
    },
);
export default User_note;