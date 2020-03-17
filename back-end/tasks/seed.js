const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;

const main = async () => {
    console.log('Seeding!');
};

main().catch(console.log);
