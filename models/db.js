import { User } from './user.js';
import { Exception } from './exception.js';
import Sequelize from 'sequelize';

export class DB {
    initialization = () => {
        let config = {
            host: process.env.DB_HOST,
            port: 3306,
            dialect: "mysql",
            timezone: "+08:00",
            dialectOptions: {
                useUTC: false,
                bigNumberStrings: true,
            },
        }

        let sequelize = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER,
            process.env.DB_PASS,
            config,
        );

        const models = {
            User: User.init(sequelize, Sequelize),
            Exception: Exception.init(sequelize, Sequelize),
        };

        Object.values(models)
            .filter(model => typeof model.associate === "function")
            .forEach(model => model.associate(models));
    }
}