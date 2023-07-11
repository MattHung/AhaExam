import express from 'express';
import { Sequelize, Op } from 'sequelize';
import { User } from '../models/user.js';
import { DashboardController } from '../controller/dashboardController'

const router = express.Router();
const dashboardController = new DashboardController();

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

    dashboardController.userSummary(req, res);
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

    dashboardController.userStatistics(req, res);
});

export { router };
