import { DataTypes, Model} from 'sequelize';
import sequelize from '../config/database.js';


class User extends Model {}

User.init(
  {
    // Model attributes are defined here
    pseudonyme: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'user', // We need to choose the model name
    tableName: 'user_data'
  },
);

export default User;