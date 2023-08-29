// Import required modules and setup the database and ORM
import { db, Orm } from '../lib/orm';
import { Submission } from './submissions';

// Define the Agreement model with its attributes
const Agreement = db.define('Agreement', {
  terms: {
    type: Orm.TEXT,
    allowNull: false,
  },
  status: {
    type: Orm.ENUM('new', 'in_progress', 'terminated'),
  },
});

Submission.belongsTo(Agreement);
Agreement.hasMany(Submission);

// Export the Agreement model to be used in other parts of the application
export default {
  Agreement,
};
