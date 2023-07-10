import 'dotenv/config'
import fs from 'fs'
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import { PassportConfig } from './config/passport.js';
import { DB } from './models/db.js'
import { router as viewRouter } from './routes/view.js';
import { router as userRouter } from './routes/user.js';
import { router as dashboardRouter } from './routes/dashboard.js';
import { Exception } from './models/exception.js'

import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger_output.json';

//handle exceptions
process.on('uncaughtException', async (err: Error) => {
    console.error(err);
    await Exception.create({
        name: err.name,
        message: err.message,
        stack: err.stack,
    });
});

process.on('unhandledRejection', async (err: Error) => {
    console.error(err);
    await Exception.create({
        name: err.name,
        message: err.message,
        stack: err.stack,
    });
});

const app = express();
const passportConfig = new PassportConfig();
const db = new DB();

app.set('port', process.env.PORT);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

passportConfig.initialization(passport);
db.initialization();

app.use(process.env.BASE_URL, viewRouter);
app.use(process.env.BASE_URL, userRouter);
app.use(process.env.BASE_URL, dashboardRouter);

app.use(process.env.BASE_URL +'doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

//copy ejs files
fs.cpSync("./views/", './_dist/views/', {recursive: true});

//start web server listen
app.listen(process.env.PORT, () => {
    console.log(`server running on port: ${process.env.PORT}`);
});
