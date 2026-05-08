import { DataTypes, Model} from 'sequelize';
import sequelize from '../config/database.js';


class Film extends Model {}

Film.init(
  {
      //attributs du modèle
    film_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateDeSortie: {
      type: DataTypes.DATE,
      allowNull: false,
    },
      realisateur_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
              model: 'Realisateurs',
              key: 'realisateur_id',
          }
      },
    duree_minute: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    //model options
    sequelize, //connection à l'instance
    modelName: 'Films', // nom du modèle
    tableName: 'Films'
  },
);
export default Film;