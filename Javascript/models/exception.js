import Sequelize from 'sequelize';

export class Exception extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        name: DataTypes.STRING(255),
        message: DataTypes.STRING(255),
        stack: DataTypes.STRING,
      },
      { 
        tableName: '_exceptions',
        sequelize 
      }
    );
  }
}
