import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { PassportConfig } from './config/passport.js';
import { DB } from './models/db.js'
import { router as viewRouter } from './routes/view.js';
import { router as userRouter } from './routes/user.js';
import { router as dashboardRouter } from './routes/dashboard.js';
import { Exception } from './models/exception.js'

import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger_output.json' assert { type: "json" };

//handle exceptions
process.on('uncaughtException', async (err) => {
  await Exception.create({
    name: err.name,
    message: err.message,
    stack: err.stack,
  });
});

process.on('unhandledRejection', async (err) => {
  await Exception.create({
    name: err.name,
    message: err.message,
    stack: err.stack,
  });
});

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

//start web server listen
app.listen(process.env.PORT, () => {
  console.log(`server running on port: ${process.env.PORT}`);
});
