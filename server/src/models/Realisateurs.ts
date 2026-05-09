import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Realisateur = sequelize.define('Realisateur', {
  id_real: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: { type: DataTypes.STRING(255), allowNull: false },
  prenom: { type: DataTypes.STRING(255) }
}, {
  tableName: 'realisateurs',
  timestamps: false,
});

export default Realisateur;