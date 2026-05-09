import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Film = sequelize.define('Film', {
  id_film: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titre: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  id_real: {
    type: DataTypes.INTEGER,
    references: { model: 'realisateurs', key: 'id_real' }
  },
  duree: {
    type: DataTypes.INTEGER,
  },
  date_de_sortie: {
    type: DataTypes.DATEONLY,
  },
  
  img: {
    type: DataTypes.TEXT,
    allowNull: true, // On autorise les films sans image
  }
}, {
  tableName: 'films',
  timestamps: false,
});

export default Film;