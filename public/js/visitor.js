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
                <img src="./pic/places/${place.images[0]}" class="card-img-top" alt="${place.images[0]}" />
                <div class="card-body">
                    <h3 class="h4">${place.placeName}</h3>
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
                `<button class='btn btn-sm btn-outline-info active category-color'>${category}</button>`
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
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content" id="place" data-id="${place._id}">
                <div class="modal-header">
                    <h1 class="h3 modal-title" id="detailModalLabel">
                        ${place.placeName}
                    </h1>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="container row">
                        <div class="placeDetail col-md-5">
                            <div id="carousel" class="carousel slide" data-ride="carousel">
                                <ol class="carousel-indicators" id="carousel-indicators">

                                </ol>
                                <div class="carousel-inner" id="carousel-inner">

                                </div>
                                <a class="carousel-control-prev" href="#carousel" role="button" data-slide="prev">
                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span class="sr-only">Previous</span>
                                </a>
                                <a class="carousel-control-next" href="#carousel" role="button" data-slide="next">
                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span class="sr-only">Next</span>
                                </a>
                            </div>
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
                                <span>$${place.placePrice}</span>
                            </div>
                            <div>
                                <span class="attribute">Display Time</span>:
                                <span>${place.displayTime}</span>
                            </div>
                            <div>
                                <span class="attribute">Remain Number</span>:
                                <span id="ticketRemainNum">${place.remainNum}</span>
                            </div>
                        </div>
                        <div class="wrapper col-md-7">
                            <form class="comment" id="commentForm">
                                <div class="commentContainer">
                                    <h2 class="h5">Comments</h2>
                                    <ul id="commentList"></ul>
                                </div>
                                <div class="inputContainer">
                                    <label class="sr-only" for="commentInput"></label>
                                    <input class="form-control" type="text" name="commentInput" id="commentInput" placeholder="Add a comment"></input>
                                    <button class="btn btn-outline-primary" id="postBtn" type="submit">
                                        Post
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">
                        Close
                    </button>
                    <button type="button" class="btn btn-primary" id="buyBtn">
                        Buy Ticket
                    </button>
                </div>
            </div>
        </div>
    `);
    $('#detailModal').append($modal);
    for (let i = 0; i < place.images.length; i++) {
        if (i === 0) {
            $modal.find('#carousel-inner').append(`
                <div class="carousel-item active">
                    <img class="d-block w-100" src="./pic/places/${place.images[0]}" alt="${place.images[0]}">
                </div>
            `);
            $modal
                .find('#carousel-indicators')
                .append(
                    `<li data-target="#carousel" data-slide-to="0" class="active"></li>`
                );
        } else {
            $modal.find('#carousel-inner').append(`
                <div class="carousel-item">
                    <img class="d-block w-100" src="./pic/places/${place.images[i]}" alt="${place.images[i]}">
                </div>
            `);
            $modal
                .find('#carousel-indicators')
                .append(
                    `<li data-target="#carousel" data-slide-to="${i}"></li>`
                );
        }
    }
    const comments = await $.ajax({
        url: `/places/placeComments/${placeId}`,
    });
    const $commentList = $modal.find('#commentList');
    for (comment of comments) {
        $comment = $(`
            <li>
                <span class="username" data-id=${comment.user}>${comment.userName}</span>:
                <span class="content">${comment.comment}</span>
            </li>`);
        $comment.find('.username').click((event) => {
            const id = $(event.currentTarget).data('id');
            window.location.replace(`/userinfo/${id}`);
        });
        $commentList.append($comment);
    }
    $('#commentForm').submit(alertSignIn);
    $('#buyBtn').click(alertSignIn);
    $('#carousel').carousel();
};

const fetchPlaces = async (store) => {
    store['places'] = await $.ajax({ url: '/places/' });
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
    if (tag.length === 0) {
        renderPlaces(store['places']);
        return;
    }
    const places = [];
    for (place of store['places']) {
        if (
            place.placeName.toLowerCase().includes(tag.toLowerCase()) ||
            place.description.toLowerCase().includes(tag.toLowerCase())
        ) {
            places.push(place);
            continue;
        }
        for (cat of place.category) {
            if (cat.toLowerCase() === tag.toLowerCase()) {
                places.push(place);
                break;
            }
        }
    }
    renderPlaces(places);
};

const filterByReset = () => {
    renderPlaces(store['places']);
};

const signin = async (event) => {
    event.preventDefault();
    window.location.replace('/entry');
};

const alertSignIn = async (event) => {
    event.preventDefault();
    await Swal.fire({
        icon: 'warning',
        title: 'Please sign in first!',
        showConfirmButton: false,
        timer: 1500,
    });
};

const bindEvent = () => {
    $('#latestBtn').click(filterByLatest);
    $('#resetBtn').click(filterByReset);
    $('#hottestBtn').click(filterByHottest);
    $('#search').submit((event) => {
        event.preventDefault();
        filterBySearch($('#searchInput').val());
    });
    $('#signinBtn').click(signin);
};

const store = {};

const main = async () => {
    await fetchPlaces(store);
    renderPlaces(store['places']);
    bindEvent();
};

main();
