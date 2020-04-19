const deepcopy = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

const getPlaceById = (id) => {
    for (place of store['places']) {
        if (place._id === id) {
            return place;
        }
    }
    return undefined;
};

const renderPlaces = (places) => {
    $('#cards').empty();

    for (place of places) {
        const card = $(`
            <div class="card" id="${place._id}">
                <img src="./pic/${place.images[0]}" class="card-img-top" alt="${place.images[0]}" />
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
            renderDetail(event.currentTarget.id);
            $('#detailModal').modal('show');
        });
        $('#cards').append(card);
    }
};

const renderDetail = async (placeId) => {
    const place = getPlaceById(event.currentTarget.id);
    $('#detailModal').empty();

    const $modal = $(`
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content" id="place" data-id="${place._id}">
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
                            <img src="./pic/${place.images[0]}" alt="${place.images[0]}" />
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
                                <button class="btn btn-outline-primary btn-sm" id="postBtn">
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
    $('#detailModal').append($modal);
    const comments = await $.ajax({ url: `http://localhost:3000/comments/placeId/${placeId}` });
    const $commentList = $modal.find('#commentList');
    for (comment of comments) {
        $comment = $(`
            <li>
                <span class="username">username</span>:
                <span class="content">${comment.comment}</span>
            </li>`);
        $commentList.append($comment);
    }
    $('#postBtn').click(postComment);
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
    renderPlaces(places);
};

const filterByHottest = () => {
    const places = deepcopy(store['places']);
    places.sort((a, b) => {
        return a.remainNum - b.remainNum;
    });
    renderPlaces(places);
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
    renderPlaces(places);
};

const filterByReset = () => {
    renderPlaces(store['places']);
};

const renderUser = () => {
    console.log(userInfo);
    console.log(userInfo['userName']);
    $('#username').text(userInfo['userName']);
};

const refreshPlaces = async () => {
    await fetchPlaces(store);
};

const refreshComment = async (placeId) => {
    const comments = await $.ajax({ url: `http://localhost:3000/comments/placeId/${placeId}` });
    const $commentList = $('#commentList');
    $commentList.empty();
    for (comment of comments) {
        $comment = $(`
            <li>
                <span class="username">username</span>:
                <span class="content">${comment.comment}</span>
            </li>`);
        $commentList.append($comment);
    }
};

const postComment = async () => {
    const comment = $('#commentInput').val();
    if (comment.length === 0) {
        alert('Please input some text!');
        return;
    }
    const placeId = $('#place').attr('data-id');
    const userId = userInfo['_id'];
    await $.ajax({
        url: 'http://localhost:3000/comments/',
        type: 'POST',
        data: {
            userId: userId,
            placeId: placeId,
            comment: comment,
        },
    });
    await refreshPlaces();
    refreshComment(placeId);
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
const userInfo = JSON.parse(Cookies.get('user'));

const main = async () => {
    await fetchPlaces(store);
    renderPlaces(store['places']);
    renderUser();
    bindEvent();
};

main();
