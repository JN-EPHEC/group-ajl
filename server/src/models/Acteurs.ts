import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Acteur = sequelize.define('Acteur', {
  id_acteurs: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: { type: DataTypes.STRING(255), allowNull: false },
  prenom: { type: DataTypes.STRING(255) }
}, {
  tableName: 'acteurs',
  timestamps: false,
});

export default Acteur;