import { DataTypes, Model} from 'sequelize';
import sequelize from '../config/database.js';

class Realisateur extends Model {}

Realisateur.init(
    {
        //attributs du modèle
        realisateur_id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        prenom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        //model options
        sequelize, //connection à l'instance
        modelName: 'Realisateur', // nom du modèle
        tableName: 'Realisateurs_data',
    },
);
export default Realisateur;