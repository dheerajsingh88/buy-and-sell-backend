// dbConnection.js

const Database = require('./db');

const dbConfig = {
    host: 'localhost',
    user: 'hapi-server',
    password: 'abc123!',
    database: 'buy-and-sell',
};

const db = new Database(dbConfig);

// Connect to the database when the application starts
db.connect()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  });

// Disconnect from the database when the application exits
process.on('SIGINT', async () => {
  await db.end();
  console.log('Disconnected from the database');
  process.exit(0);
});

module.exports = db;
