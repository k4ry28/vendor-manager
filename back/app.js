import express, { json, urlencoded } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import 'dotenv/config';

import agreementsRouter from './routes/agreements.js';
import submissionsRouter from './routes/submissions.js';
import accountsRouter from './routes/accounts.js';
import balanceRouter from './routes/balances.js';
import adminRouter from './routes/admin.js';
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
app.use('/submissions', submissionsRouter);
app.use('/accounts', accountsRouter);
app.use('/balances', balanceRouter);
app.use('/admin', adminRouter);
app.use('/users', usersRouter);

export default app;
