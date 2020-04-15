const deepcopy = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

const renderPlace = (places) => {
    $('#cards').empty();

    for (place of places) {
        const card = $(`
        <div class="card">
            <img src="./pic/${place.imageName}" class="card-img-top" alt="${place.imageName}" />
            <div class="card-body">
                <p class="card-text">
                    ${place.description}
                </p>
            </div>
            <div class="card-bottom">
                <div class="card-info">
                    <div class="displayTime">
                        Display Time: <span>${place.displayTime}</span>
                    </div>
                    <div class="remain">
                        Tickets: <span class="num">${place.remainNum}</span>
                    </div>
                    <div class="buttons">
                        <button class="btn btn-sm btn-outline-secondary" data-toggle="modal" data-target="#detailModal">
                            Detail
                        </button>
                        <button class="btn btn-sm btn-outline-secondary">
                            Buy
                        </button>
                    </div>
                </div>
            </div>
        </div>`);
        $('#cards').append(card);
    }
};

const fetchPlaces = async (store) => {
    store['places'] = await $.ajax({ url: 'http://localhost:3000/places/' });
};

const filterByLatest = () => {
    const places = deepcopy(store['places']);
    places.sort((a, b) => {
        const time1 = a.displayTime;
        const time2 = b.displayTime;
        const arr1 = time1.split('-');
        const arr2 = time2.split('-');
        for (let i = 0; i < 3; i++) {
            if (arr1[i] < arr2[i]) {
                return -1;
            }
            if (arr1[i] > arr2[i]) {
                return 1;
            }
        }
        return 0;
    });
    places.reverse();
    renderPlace(places);
};

const filterByHottest = () => {
    const places = deepcopy(store['places']);
    places.sort((a, b) => {
        return a.remainNum - b.remainNum;
    });
    renderPlace(places);
};

const filterByReset = () => {
    renderPlace(store['places']);
};

const bindEvent = () => {
    $('#latestBtn').click(filterByLatest);
    $('#resetBtn').click(filterByReset);
    $('#hottestBtn').click(filterByHottest);
};

const store = {};

const main = async () => {
    await fetchPlaces(store);
    renderPlace(store['places']);
    bindEvent();
};

main();
