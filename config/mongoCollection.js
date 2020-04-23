const dbConnection = require('./mongoConnection');

const getCollectionFn = (collection) => {
    let _col = undefined;

    return async () => {
        if (!_col) {
            const db = await dbConnection();
            _col = await db.collection(collection);
        }

        return _col;
    };
};

module.exports = {
    users: getCollectionFn('users'),
    tickets: getCollectionFn('tickets'),
    comments: getCollectionFn('comments'),
    places: getCollectionFn('places'),
    counts: getCollectionFn('counts'),
    friends: getCollectionFn('friends'),
    banks: getCollectionFn('banks'),
};
