import { Op } from 'sequelize';
import { User } from '../models/user.js';

/*
 * DashboardController
 *
 * handle dashboard api logic
 */

export class DashboardController {
    userSummary = async (req, res) : Promise<void> => {
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
    }

    userStatistics = async(req, res) : Promise<void> => {
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
    }

}