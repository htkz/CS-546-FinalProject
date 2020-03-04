const mongoCollections = require("../config/mongoCollection");
const users = mongoCollections.users;

let exportedMethods = {
    getAllUsers() {
        return users().then(userCollection => {
            return userCollection.find({}).toArray();
        });
    },
    getUserById(id) {
        return users().then(userCollection => {
            return userCollection.findOne({ _id: id }).then(user => {
                if (!user) throw "User not found";
                return user;
            });
        });
    },
    addUser(userInfo) {
        return users().then(userCollection => {
            return userCollection
                .insertOne(userInfo)
                .then(newInsertInformation => {
                    return newInsertInformation.insertedId;
                })
                .then(newId => {
                    return this.getUserById(newId);
                });
        });
    },
    removeUser(id) {
        return users().then(userCollection => {
            return userCollection.removeOne({ _id: id }).then(deletionInfo => {
                if (deletionInfo.deletedCount === 0) {
                    throw `Could not delete user with id of ${id}`;
                }
            });
        });
    },
    updateUser(id, userInfo) {
        return this.getUserById(id).then(currentUser => {
            return userCollection.updateOne({ _id: id }, updatedUser).then(() => {
                return this.getUserById(id);
            });
        });
    }
};

module.exports = exportedMethods;