// Import required modules and setup the database and ORM
import { db, Orm } from '../lib/orm.js';
import { Agreement } from './agreement.js';
import { User } from './users.js';

// Define the Account model with its attributes
const Account = db.define('Account', {
  firstName: {
    type: Orm.STRING,
    allowNull: false,
  },
  lastName: {
    type: Orm.STRING,
    allowNull: false,
  },
  profession: {
    type: Orm.STRING,
    allowNull: false,
  },
  balance: {
    type: Orm.DECIMAL(12, 2),
  },
  type: {
    type: Orm.ENUM('buyer', 'supplier'),
  },
});

// Set up associations between the Account and Agreement models
Agreement.belongsTo(Account, { as: 'Supplier' });
Agreement.belongsTo(Account, { as: 'Buyer' });
Account.hasMany(Agreement, { as: 'Supplier', foreignKey: 'SupplierId' });
Account.hasMany(Agreement, { as: 'Buyer', foreignKey: 'BuyerId' });
Account.belongsTo(User, { as: 'User' });
User.hasMany(Account, { as: 'Account', foreignKey: 'UserId' });

// Export the Account model to be used in other parts of the application
export {
  Account,
};
