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
        100,
        ['school', 'quiet'],
        '2020-03-17',
        200,
        ['Stevens_Institute_Of_Technology.jpg', 'ticket2.jpg']
    );

    await places.addPlace(
        'Kennedy Space Center',
        'To discover and expand knowledge for the benefit of humanity.',
        'Titusville, Florida',
        '32899',
        50,
        ['building', 'science'],
        '2020-02-18',
        200,
        ['NASA.jpg', 'ticket1.jpeg']
    );

    await places.addPlace(
        'Statue of Liberty',
        'A famous school in New Jersey',
        'Liberty Island Manhattan, New York City, New York,',
        '10004',
        59,
        ['Historical landmark', 'quiet'],
        '2019-12-13',
        100,
        ['Statue_Of_Liberty.jpg', 'ticket1.jpeg']
    );

    await places.addPlace(
        'Universal_Studio',
        'Famous, sprawling amusement park featuring movie-themed rides, attractions & entertainment.',
        '6000 Universal Blvd, Orlando, FL',
        '32819',
        189,
        ['Theme park', 'Happy'],
        '2018-04-17',
        50,
        ['Universal_Studio.jpg', 'ticket1.jpeg']
    );

    await places.addPlace(
        'Empire State Building',
        'Iconic, art deco office tower from 1931 with exhibits & observatories on the 86th & 102nd floors',
        '20 W 34th St, New York, NY',
        '10001',
        20,
        ['Historical landmark', 'quiet'],
        '2022-04-27',
        1000,
        ['Empire_State_Building.jpg', 'ticket2.jpg']
    );

    await users.addUser('htkz', 'admin@gmail.com', 'Qq123456');

    await users.addUser('Admin', 'admin@group13.com', 'Qq123456');

    console.log('Done seeding database');

    await db.serverConfig.close();
};

main();
