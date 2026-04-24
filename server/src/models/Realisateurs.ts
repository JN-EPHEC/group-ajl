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
        modelName: 'Realisateurs', // nom du modèle
        tableName: 'Realisateurs',
    },
);
export default Realisateur;