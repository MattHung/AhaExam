import { Sequelize, Model, InferAttributes, InferCreationAttributes, DataTypes } from 'sequelize';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare name: string;
  declare email: string;
  declare registration_type: string;
  declare social_user_id: number;
  declare verify_token: string;
  declare verifiedAt: Date;
  declare login_count: number;
  declare password: string;
  declare createdAt: Date;
  declare updatedAt: Date;


  public static initialization(sequelize: Sequelize) {
    return User.init(
      {
        name: DataTypes.STRING(45),
        email: DataTypes.STRING(100),
        registration_type: DataTypes.ENUM("email", "google", "facebook"),
        social_user_id: DataTypes.STRING(30),
        verify_token: DataTypes.STRING(255),
        verifiedAt: DataTypes.DATE,
        login_count: DataTypes.NUMBER,
        password: DataTypes.STRING(80),
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        tableName: 'users',
        sequelize
      }
    );
  }
}


