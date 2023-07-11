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
        name: DataTypes.STRING(45),           //user name
        email: DataTypes.STRING(100),         //user email
        registration_type: DataTypes.ENUM("email", "google", "facebook"), //type of where the user register from
        social_user_id: DataTypes.STRING(30), //social id if user come from Facebook / Google
        verify_token: DataTypes.STRING(255),  //verification token if user use email for registration
        verifiedAt: DataTypes.DATE,           //verification token if user use email for registration and verified via email
        login_count: DataTypes.NUMBER,        //user session login count
        password: DataTypes.STRING(80),       //user account password, use for email login only
        createdAt: DataTypes.DATE,            //user account create timestamp
        updatedAt: DataTypes.DATE,            //user account data update timestamp
      },
      {
        tableName: 'users',
        sequelize
      }
    );
  }
}


