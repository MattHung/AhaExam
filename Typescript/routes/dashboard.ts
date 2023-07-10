import express from 'express';
import { Sequelize, Op } from 'sequelize';
import { User } from '../models/user.js';

const router = express.Router();

router.get('/dashboard/user_summary', async (req, res): Promise<void> => {
    /* 	#swagger.tags = ['dashboard'] */

    /* #swagger.security = [{
        "apiKeyAuth": []
    }] */

    /*	#swagger.parameters['limit'] = {
            in: 'query',
            description: 'query pagination limit.',
            required: true,
            schema: {
                type: 10,
            }
    } */

    /*	#swagger.parameters['offset'] = {
            in: 'query',
            description: 'query pagination offset.',
            required: true,
            schema: {
                type: 0,
            }
    } */

    /* #swagger.responses[200] = {
            description: 'request successfully processed.',
            schema: { $ref: "#/definitions/DashBoardSummuryApiResult" }
    } */


    let limit: number = parseInt(req.query.limit);
    let offset: number = parseInt(req.query.offset);

    if (isNaN(limit))
        limit = 0;
    if (isNaN(offset))
        offset = 0;

    let queryRes: User[] = await User.findAll({
        attributes: [
            ['name', 'user_name'],
            ['registration_type', 'registration_type'],
            ['createdAt', 'timestamp_signedup'],
            ['login_count', 'count_loggedin'],
            ['updatedAt', 'timestamp_last_session']
        ],        
        limit: limit,
        offset: offset, 
    });

    res.json(queryRes);
});

router.get('/dashboard/user_statistics', async (req, res): Promise<void> => {
    /* 	#swagger.tags = ['dashboard'] */

    /* #swagger.security = [{
        "apiKeyAuth": []
    }] */

    /* #swagger.responses[200] = {
            description: 'request successfully processed.',
            schema: { $ref: "#/definitions/DashBoardStatisticApiResult" }
    } */

    // At the top of the user database dashboard, show the following 
    // statistics:
    //     Total number of users who have signed up.
    //     Total number of users with active sessions today.
    //     Average number of active session users in the last 7 days rolling.


    let totalSignup:number = await User.count({
        where: {
            login_count: { [Op.gt]: 0 },
        },
    });

    let totalTodayActive:number = await User.count({
        where: {
            updatedAt: { [Op.gt]: new Date().setHours(0, 0, 0, 0) },
            login_count: { [Op.gt]: 0 },
        },
    });

    let averageActiveIn7Days:number = await User.count({
        where: {
            updatedAt: {
                [Op.between]: [new Date().setDate(new Date().getDate() - 7), new Date().getTime()],
            },
        },
    });

    averageActiveIn7Days /= 7;
    averageActiveIn7Days = averageActiveIn7Days;

    res.json([{
        totalSignup: totalSignup,
        totalTodayActive: totalTodayActive,
        averageActiveIn7Days: Math.round(averageActiveIn7Days),
    }]);
});

export { router };
