const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const places = data.places;

const main = async () => {
    const db = await dbConnection();
    const allPlaces = await places.getAllPlaces();
    if (allPlaces.length !== 0) {
        console.log('Database already exist, stop seeding!');
        return;
    }
    await places.addPlace(
        'Stevens',
        'A famous school in New Jersey',
        '1 Castle Point Terrace, Hoboken',
        '07310',
        20000,
        ['school', 'quiet'],
        '2020-03-17',
        400,
        'stevens.jpg'
    );

    console.log('Done seeding database');

    await db.serverConfig.close();
};

main();
