import { Sequelize, Model, InferAttributes, InferCreationAttributes, DataTypes } from 'sequelize';

export class Exception extends Model<InferAttributes<Exception>, InferCreationAttributes<Exception>> {
  declare name: string;
  declare message: string;
  declare stack: string;

  public static initialization(sequelize: Sequelize) {
    return Exception.init(
      {
        name: DataTypes.STRING(255),    //the error name
        message: DataTypes.STRING(255), //the detail message
        stack: DataTypes.STRING,        //the callstack
      },
      {
        tableName: '_exceptions',
        sequelize
      }
    );
  }
}
