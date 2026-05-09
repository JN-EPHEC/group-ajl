import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Acteurs_films = sequelize.define('Acteurs_films', {
  id_acteurs: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: { model: 'acteurs', key: 'id_acteurs' }
  },
  id_film: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: { model: 'films', key: 'id_film' }
  }
}, {
  tableName: 'acteurs_films',
  timestamps: false,
});

export default Acteurs_films;