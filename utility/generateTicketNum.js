let exportedMethods = {
    ticketNo(index, placeId, orderedDate) {
        let placeNumber = '';
        for (item of placeId.slice(-2)) {
            placeNumber += item.charCodeAt();
        }

        const orderedDateNumber = orderedDate.replace(/[^0-9]/gi, '').slice(2);
        ticketNo = `${placeNumber}${orderedDateNumber}${index}`;

        return ticketNo;
    },
};

module.exports = exportedMethods;
