import { Sequelize } from 'sequelize';

const db = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite3',
});

export default {
  db,
  Orm: Sequelize,
};
