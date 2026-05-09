import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Users_watchlist = sequelize.define('Users_watchlist', {
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
  date_ajout: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'users_watchlists',
  timestamps: false,
});

export default Users_watchlist;