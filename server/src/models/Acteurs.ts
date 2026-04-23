import { DataTypes, Model} from 'sequelize';
import sequelize from '../config/database.js';

class Acteur extends Model {}

Acteur.init(
    {
        //attributs du modèle
        acteur_id:{
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
        modelName: 'Acteur', // nom du modèle
        tableName: 'Acteurs_data',
    },
);
export default Acteur;