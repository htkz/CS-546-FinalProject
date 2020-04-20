const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const places = data.places;
const users = data.users;

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();
    // await counts.addData('ticketNo', 0);

    await places.addPlace(
        'Stevens',
        'A famous school in New Jersey',
        '1 Castle Point Terrace, Hoboken',
        '07310',
        20000,
        ['school', 'quiet'],
        '2020-03-17',
        300,
        ['ticket1.jpeg', 'ticket2.jpg']
    );

    await places.addPlace(
        'Gateway South',
        'A famous building in Stevens Institute of Technology',
        '1 Castle Point Terrace, Hoboken',
        '07310',
        500,
        ['building', 'quiet'],
        '2020-02-18',
        200,
        ['ticket2.jpg', 'ticket1.jpeg']
    );

    await places.addPlace(
        'Stevens',
        'A famous school in New Jersey',
        '1 Castle Point Terrace, Hoboken',
        '07310',
        20000,
        ['school', 'quiet'],
        '2019-12-13',
        100,
        ['ticket3.jpg', 'ticket1.jpeg']
    );

    await places.addPlace(
        'Stevens',
        'A famous school in New Jersey',
        '1 Castle Point Terrace, Hoboken',
        '07310',
        20000,
        ['school', 'quiet'],
        '2018-04-17',
        50,
        ['ticket2.jpg', 'ticket1.jpeg']
    );

    await places.addPlace(
        'Stevens',
        'A famous school in New Jersey',
        '1 Castle Point Terrace, Hoboken',
        '07310',
        20000,
        ['school', 'quiet'],
        '2022-04-27',
        1000,
        ['ticket3.jpg', 'ticket2.jpg']
    );

    await users.addUser('htkz', 'admin@gmail.com', 'Qq123456');

    console.log('Done seeding database');

    await db.serverConfig.close();
};

main();
