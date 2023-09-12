import { db, Orm } from '../lib/orm.js';

const User = db.define('User', {
    username: {
        type: Orm.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Orm.STRING,
        allowNull: false,
    },
    role: {
        type: Orm.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user',
    },
});

export {
    User,
};