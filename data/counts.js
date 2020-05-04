const mongoCollections = require('../config/mongoCollection');
const counts = mongoCollections.counts;

let exportedMethods = {
    async getNextSequenceValue(sequenceName) {
        const count = await counts();

        await count.updateOne(
            { _id: sequenceName },
            { $inc: { sequenceValue: 1 } }
        );

        const sequenceDocument = await count.findOne({ _id: sequenceName });

        return sequenceDocument;
    },

    async addData(id, sequenceValue) {
        const count = await counts();

        let newCount = {
            _id: id,
            sequenceValue: sequenceValue,
        };

        await count.insertOne(newCount);

        return true;
    },

    async findDataById(sequenceName) {
        const count = await counts();

        const sequenceDocument = await count.findOne({ _id: sequenceName });

        return sequenceDocument;
    },
};

module.exports = exportedMethods;
