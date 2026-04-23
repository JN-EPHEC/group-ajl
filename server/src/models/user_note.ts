import { DataTypes, Model} from 'sequelize';
import sequelize from '../config/database.js';


class user_note extends Model {}

user_note.init(
  {
    // Model attributes are defined here
    ID_film: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    note: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    commentaire: {
        type: DataTypes.STRING,
        allowNull: true,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'user_note', // We need to choose the model name
    tableName: 'user_note'
  },
);

export default user_note;