import { DataTypes, Model} from 'sequelize';
import sequelize from '../config/database.js';


class User extends Model {}

User.init(
  {
    // Model attributes are defined here
    prenom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'user', // We need to choose the model name
    tableName: 'users'
  },
);

export default User;