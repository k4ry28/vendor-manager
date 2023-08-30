import { Sequelize } from 'sequelize';

const db = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite3',
});

const Orm = Sequelize;

export {
  db,
  Orm,
};
