import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Genre = sequelize.define('Genre', {
  id_genre: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: { type: DataTypes.STRING(255), allowNull: false }
}, {
  tableName: 'genres',
  timestamps: false,
});

export default Genre;