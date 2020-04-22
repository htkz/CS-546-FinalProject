const mongoCollections = require('../config/mongoCollection');
const counts = mongoCollections.counts;

let exportedMethods = {
    async getNextSequenceValue(sequenceName) {
        const count = await counts();

        await count.updateOne(
            { _id: sequenceName },
            { $inc: { sequence_value: 1 } }
        );

        const sequenceDocument = await count.findOne({ _id: sequenceName });

        return sequenceDocument;
    },

    async addData(id, sequence_value) {
        const count = await counts();

        let newCount = {
            _id: id,
            sequence_value: sequence_value,
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
