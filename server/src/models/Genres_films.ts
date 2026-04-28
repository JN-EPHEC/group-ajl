import { DataTypes, Model} from 'sequelize';
import sequelize from '../config/database.js';

class Genre_film extends Model {}

Genre_film.init(
    {
        //attributs du modèle
        genre_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Genres',
                key: 'genre_id',
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
    },
    {
        //model options
        sequelize, //connection à l'instance
        modelName: 'Genres_films', // nom du modèle
        tableName: 'Genres_films',
    },
);
export default Genre_film;