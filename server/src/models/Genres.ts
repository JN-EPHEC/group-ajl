import { DataTypes, Model} from 'sequelize';
import sequelize from '../config/database.js';

class Genre extends Model {}

Genre.init(
    {
        //attributs du modèle
        genre_id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        //model options
        sequelize, //connection à l'instance
        modelName: 'Genres', // nom du modèle
        tableName: 'Genres',
    },
);
export default Genre;