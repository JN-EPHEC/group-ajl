import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Film extends Model {}

Film.init(
  {
    film_id: {
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
    
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    synopsis: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Films',
    tableName: 'Films'
  },
);

export default Film;