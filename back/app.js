import express, { json, urlencoded } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import agreementsRouter from './routes/agreements.js';
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js';

var app = express();

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(join(__dirname, 'public'));

app.use('/auth', authRouter);
app.use('/agreements', agreementsRouter);
app.use('/users', usersRouter);

export default app;
