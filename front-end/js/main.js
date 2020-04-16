

const deepcopy = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

const setDetail = (id) => {
    console.log(id);
};

const renderPlace = (places) => {
    $('#cards').empty();

    for (place of places) {
        const card = $(`
            <div class="card" id="${place._id}">
                <img src="./pic/${place.imageName}" class="card-img-top" alt="${place.imageName}" />
                <div class="card-body">
                    <h4>${place.placeName}</h4>
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
                            Tickets: <span>${place.remainNum}</span>
                        </div>
                        <div class="category"></div>
                    </div>
                </div>
            </div>`);
        for (category of place.category) {
            const cat = $(
                `<button class='btn btn-sm btn-outline-info active'>${category}</button>`
            );
            card.find('.category').append(cat);
        }
        card.click((event) => {
            for (place of store['places']) {
                if (place._id === event.currentTarget.id) {
                    renderDetail(place);
                    break;
                }
            }
            $('#detailModal').modal('show');
        });
        $('#cards').append(card);
    }
};

const renderDetail = (place) => {
    $('#detailModal').empty();

    const $modal = $(`
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title" id="detailModalLabel">
                        ${place.placeName}
                    </h3>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="container row">
                        <div class="placeDetail col-md-5">
                            <img src="./pic/${place.imageName}" alt="${place.imageName}" />
                            <div class="attribute">Description</div>
                            <p class="card-text">
                                ${place.description}
                            </p>
                            <div>
                                <div class="attribute">Address</div>
                                <span>${place.placeAddress}</span>
                            </div>
                            <div>
                                <span class="attribute">Zipcode</span>:
                                <span>${place.placeZipCode}</span>
                            </div>
                            <div>
                                <span class="attribute">Price</span>:
                                <span>${place.placePrice}</span>
                            </div>
                            <div>
                                <span class="attribute">Display Time</span>:
                                <span>${place.displayTime}</span>
                            </div>
                            <div>
                                <span class="attribute">Remain Number</span>:
                                <span>${place.remainNum}</span>
                            </div>
                        </div>
                        <div class="comment col-md-7">
                            <h5>Comments</h5>
                            <div class="commentContainer">
                                <ul id="commentList"></ul>
                            </div>
                            <div class="inputContainer">
                                <textarea name="commentInput" id="commentInput" cols="70" rows="1" placeholder="Add a comment"></textarea>
                                <button class="btn btn-outline-primary btn-sm">
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">
                        Close
                    </button>
                    <button type="button" class="btn btn-primary">
                        Buy Ticket
                    </button>
                </div>
            </div>
        </div>
    `);
    const $commentList = $modal.find('#commentList');
    for (comment of place.placeUserComments) {
        $comment = $(`
            <li>
                <span class="username">username</span>:
                <span class="content">${comment}</span>
            </li>`);
        $commentList.append($comment);
    }
    $('#detailModal').append($modal);
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

const filterBySearch = (tag) => {
    if (tag.length === 0) return;
    const places = [];
    for (place of store['places']) {
        console.log(place.category);
        if (place.category.includes(tag.toLowerCase())) {
            places.push(place);
        }
    }
    renderPlace(places);
};

const filterByReset = () => {
    renderPlace(store['places']);
};

const bindEvent = () => {
    $('#latestBtn').click(filterByLatest);
    $('#resetBtn').click(filterByReset);
    $('#hottestBtn').click(filterByHottest);
    $('#search').submit((event) => {
        event.preventDefault();
        filterBySearch($('#searchInput').val());
    });
};

const store = {};

const main = async () => {
    await fetchPlaces(store);
    renderPlace(store['places']);
    bindEvent();
};

main();
