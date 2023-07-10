import { User } from './user.js';
import { Exception } from './exception.js';
import { Sequelize, Options } from 'sequelize';

export class DB {
    initialization = () => {
        let config: Options = {
            database: process.env.DB_NAME,
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            host: process.env.DB_HOST,
            port: 3306,
            dialect: "mysql",
            timezone: "+08:00",
            dialectOptions: {
                useUTC: false,
                dateStrings: true,
                typeCast: true,
                bigNumberStrings: true,
            },
        }


        let sequelize: Sequelize = new Sequelize(config);

        const models: Object = {
            User: User.initialization(sequelize),
            Exception: Exception.initialization(sequelize),
        };

        Object.values(models)
            .filter(model => typeof model.associate === "function")
            .forEach(model => model.associate(models));
    }
}