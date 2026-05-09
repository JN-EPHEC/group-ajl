import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Genres_films = sequelize.define('Genres_films', {
  id_genre: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: { model: 'genres', key: 'id_genre' }
  },
  id_film: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: { model: 'films', key: 'id_film' }
  }
}, {
  tableName: 'genres_films',
  timestamps: false,
});

export default Genres_films;