import { DataTypes, Model} from 'sequelize';
import sequelize from '../config/database.js';

class User extends Model {}

User.init(
  {
      //attributs du modèle
    user_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    pseudonyme: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    motdepasse: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    //model options
    sequelize, //connection à l'instance
    modelName: 'User', // nom du modèle
    tableName: 'Users_data'
  },
);
export default User;