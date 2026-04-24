import { DataTypes, Model} from 'sequelize';
import sequelize from '../config/database.js';

class Acteur_film extends Model {}

Acteur_film.init(
    {
        // Model attributes are defined here
        acteur_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Acteurs',
                key: 'acteur_id',
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
        modelName: 'Acteurs_films', // nom du modèle
        tableName: 'Acteurs_films',
    },
);
export default Acteur_film;