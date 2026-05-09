import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User_note = sequelize.define('User_note', {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: { model: 'users', key: 'id_user' }
  },
  id_film: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: { model: 'films', key: 'id_film' }
  },
  note: { type: DataTypes.DECIMAL(3, 1) },
  commentaire: { type: DataTypes.TEXT }
}, {
  tableName: 'users_notes',
  timestamps: false,
});

export default User_note;