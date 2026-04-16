import { DataTypes, Model} from 'sequelize';
import sequelize from '../config/database.js';


class Film extends Model {}

Film.init(
  {
    // Model attributes are defined here
    titre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateDeSortie: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    realisateur: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duree: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    genres: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    acteurs: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    moyenne: {
      type: DataTypes.FLOAT,
      allowNull: false,
    }
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'film', // We need to choose the model name
    tableName: 'films_data'
  },
);

export default Film;