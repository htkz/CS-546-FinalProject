const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const places = data.places;
const users = data.users;
const friends = data.friends;
const comments = data.comments;
const banks = data.banks;
const tickets = data.tickets;

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();

    // add place
    const place1 = await places.addPlace(
        'Stevens',
        'A famous school in New Jersey',
        '1 Castle Point Terrace, Hoboken',
        '07310',
        100,
        ['University', 'Quiet'],
        '2020-05-15',
        200,
        [
            'Stevens_Institute_Of_Technology_1.jpg',
            'Stevens_Institute_Of_Technology_2.jpg',
            'Stevens_Institute_Of_Technology_3.png',
        ]
    );

    const place2 = await places.addPlace(
        'Kennedy Space Center',
        'To discover and expand knowledge for the benefit of humanity.',
        'Titusville, Florida',
        '32899',
        50,
        ['Building', 'Science', 'Museum'],
        '2021-02-18',
        200,
        ['NASA_1.jpg', 'NASA_2.jpg']
    );

    const place3 = await places.addPlace(
        'Statue of Liberty',
        'Iconic National Monument opened in 1886, offering guided tours, a museum & city views.',
        'Liberty Island Manhattan, New York City, New York,',
        '10004',
        59,
        ['Historical landmark', 'Quiet', 'Shopping'],
        '2020-06-15',
        100,
        ['Statue_Of_Liberty_1.jpg', 'Statue_Of_Liberty_2.jpg']
    );

    const place4 = await places.addPlace(
        'Universal Studio',
        'Famous, sprawling amusement park featuring movie-themed rides, attractions & entertainment.',
        '6000 Universal Blvd, Orlando, FL',
        '32819',
        189,
        ['Theme park', 'Happy', 'Adventure'],
        '2020-09-17',
        50,
        [
            'Universal_Studio_1.jpg',
            'Universal_Studio_2.jpg',
            'Universal_Studio_3.jpg',
        ]
    );

    const place5 = await places.addPlace(
        'Empire State Building',
        'Iconic, art deco office tower from 1931 with exhibits & observatories on the 86th & 102nd floors',
        '20 W 34th St, New York, NY',
        '10001',
        20,
        ['Historical landmark', 'Quiet', 'Building'],
        '2022-04-27',
        1000,
        ['Empire_State_Building_1.jpg', 'Empire_State_Building_2.jpg']
    );

    // add user
    const user1 = await users.addUser('John', 'group13@gmail.com', 'Qq123456');

    const user2 = await users.addUser('Zechen', 'feng@gmail.com', 'Ww123456');

    const user3 = await users.addUser('MoSun', 'sunmo@gmail.com', 'Ee123456');

    const user4 = await users.addUser('Yuqi', 'wangyuqi@gmail.com', 'Rr123456');

    const user5 = await users.addUser('Xunzhi', 'lixun@gmail.com', 'Tt123456');

    const admin = await users.addUser('Admin', 'admin@group13.com', 'Qq123456');

    // add friend
    const friend1 = await friends.addFriend(
        user1['_id'].toString(),
        'Yui Hatano',
        'yuihatano@gmail.com',
        '5066086790'
    );
    const friend2 = await friends.addFriend(
        user1['_id'].toString(),
        'Angelina Jolie',
        'angelinajolie@gmail.com',
        '5126532367'
    );
    const firend3 = await friends.addFriend(
        user1['_id'].toString(),
        'Anne Hathaway',
        'annehathaway@gmail.com',
        '7276351197'
    );

    // add comment
    const comment1 = await comments.addComment(
        user1['_id'].toString(),
        place1['_id'].toString(),
        "The view of the city and the campus are beautiful. The cafeteria has improved. However, there are a lot of cons at this school. The library has been renovated so that there is more space for students to study. However, if you are looking for a quite study space, do not expect to find it here. There are a lot of study groups and project groups that meet in the library and it can be very difficult to concentrate. It is nice that in many classes, you recognize faces and can often find people to study with. However, most teachers are not very good at teaching their subjects and students more often than not, need to learn the material on their own. The free student tutoring center is a great resource to help with this. Furthermore, the staff is horrible. If I have an issue that needs addressing, I can call the same person multiple times in a day, a few days in a row and rarely do I get an answer. It is really frustrating especially if you have a very busy schedule and cannot make it up to their offices to speak to them. One of the few redeeming qualities that this school does have is the job placement rate and the expected return on investment. But honestly, if I had the chance now to have done it over again or picked another school, I'm not sure that the job placement rate and the ROI could have been enough to convince me to come back."
    );
    const comment2 = await comments.addComment(
        user2['_id'].toString(),
        place1['_id'].toString(),
        'Best school for higher education for science, engineering and business. Located at most beautiful location on the high castle point, on the banks of Hudson River across Manhattan skyline. They need to build couple of multistory covered parking garages soon to get over the parking challenges.'
    );
    const comment3 = await comments.addComment(
        user3['_id'].toString(),
        place1['_id'].toString(),
        'Stevens is a great learning center. I loved all my professors. Thank you for the scholarship.'
    );
    const comment4 = await comments.addComment(
        user1['_id'].toString(),
        place2['_id'].toString(),
        'Nice place to walk around and check out the history of our space adventures.'
    );
    const comment5 = await comments.addComment(
        user4['_id'].toString(),
        place2['_id'].toString(),
        'The gift shop also provides a range of clothing and souvenirs to take home."'
    );
    const comment6 = await comments.addComment(
        user5['_id'].toString(),
        place3['_id'].toString(),
        'This was definitely a bucket list item for me and my visit did not disappoint! We were met, promptly at Battery Park, by our diminutive tour guide, Sheree, who sported a bright pink ball cap, which came in very handy to spot her as she guided us through the crowds. One of the crew members told me that the boat has a capacity to carry 800 passengers which was mind blowing to me. As we approached Liberty island and got closer to the statue the atmosphere became hushed as we collectively embraced her aura. The process of getting us on and off the boat was surprisingly orderly considering the number of people. Our guide took us through the process and was extremely informative. I was very impressed with her wealth of knowledge. I asked and she said she had been doing this for many years. She is SKILLED! She got on the ground to take pictures for us so that we could have the Statue in the background! Now that is great customer service! Thank you, Sheree! I highly recommend this tour and encourage you to go on to Ellis Island also.'
    );
    const comment7 = await comments.addComment(
        user3['_id'].toString(),
        place4['_id'].toString(),
        "We went for two days for my son's Magic Moments trip (he has leukemia but is in remission). We had a blast!! The employees escorted us to the front of every line, which surprised me because Disney did not even do that. All of the employees were super friendly and accommodating. My son LOVED the Spider-Man ride and wanted to ride it again and again. He also got to meet him and Spider-Man was so kind to him. Thank you guys for showing us 2 fun-filled days!! We all enjoyed Universal more than Disney World and can't wait to go back. The only suggestion I would have is please do away with some of the screen rides!!"
    );
    const comment8 = await comments.addComment(
        user2['_id'].toString(),
        place4['_id'].toString(),
        "What can I say, its Universal and it's brilliant. My family's favourite park. We are all Harry Potter fans and it was our first time seeing the Harry Potter experience, just awesome. We stayed a few days in the Hard Rock Hotel and it was so easy to get to the parks. We did the Marvel dining experience for the kids, they loved it"
    );
    const comment9 = await comments.addComment(
        user4['_id'].toString(),
        place5['_id'].toString(),
        'Universal Studios Florida was amazing. We got the park to park pass and got to visit two parks and had such a great time. Our favorite rides had to be the Rocket Ride, the Harry Potter ride, The Mummy, and Fast and Furious. It was so amazing to see Hogwarts and all of the Harry Potter Aries. Our son was even chosen to experience a wand choosing him. Great family time all around.'
    );
    const comment10 = await comments.addComment(
        user1['_id'].toString(),
        place5['_id'].toString(),
        "We did this and the top of the Rock with our city pass. This place was awesome and I love how they have added so much to it to make it much more than just going up to see the skyline. There are a lot of educational museum type props there no as well that my husband said didn't used to be. The line to get in is a struggle and patience is key but I would certainly recommend it over TOR if you had to chose! It was so beautiful GO AT NIGHT!!"
    );
    const comment11 = await comments.addComment(
        user5['_id'].toString(),
        place5['_id'].toString(),
        'It really is spectacular. The building just breathes history. Amazing new lobby/museum where you can learn some facts from the past. Also very interactive. People running working there are just a joy. They really love what they are doing. And once you get to the top, it truly is breathtaking.'
    );

    // add bank card
    const bank = await banks.addBank(
        user1['_id'].toString(),
        'Group',
        '13',
        '07302',
        '4916611922198808',
        '10/21',
        '624'
    );

    console.log('Done seeding database');

    await db.serverConfig.close();
};

main();
