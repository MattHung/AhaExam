import Sequelize from 'sequelize';

export class User extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        name: DataTypes.STRING(45),
        email: DataTypes.STRING(100),
        registration_type: DataTypes.ENUM("email", "google", "facebook"),
        social_user_id: DataTypes.STRING(30),
        verify_token: DataTypes.STRING(255),
        verifiedAt : DataTypes.DATE,
        password: DataTypes.STRING(80),
      },
      { 
        tableName: 'users',
        sequelize 
      }
    );
  }
}
