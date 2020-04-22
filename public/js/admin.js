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
                            <p class="description" contenteditable="false" >
                                ${place.description}
                            </p>
                            <div>
                                <div class="attribute">Address</div>
                                <span class="placeAddress" contenteditable="false">${place.placeAddress}</span>
                            </div>
                            <div>
                                <span class="attribute">Zipcode</span>:
                                <span class="placeZipCode" contenteditable="false">${place.placeZipCode}</span>
                            </div>
                            <div>
                                <span class="attribute">Price</span>:
                                <span class="placePrice" contenteditable="false">${place.placePrice}</span>
                            </div>
                            <div>
                                <span class="attribute">Display Time</span>:
                                <span class="_displayTime" contenteditable="false">${place.displayTime}</span>
                            </div>
                            <div>
                                <span class="attribute">Remain Number</span>:
                                <span class="remainNum" contenteditable="false">${place.remainNum}</span>
                            </div>
                        </div>
                        <div class="wrapper col-md-7">
                            <div class="comment">
                                <h5>Comments</h5>
                                <div class="commentContainer">
                                    <ul id="commentList"></ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">
                        Close
                    </button>
                    <button type="button" class="btn btn-primary" id="editBtn">
                        Edit
                    </button>
                </div>
            </div>
        </div>
    `);
    $('#detailModal').append($modal);
    const comments = await $.ajax({
        url: `http://localhost:3000/places/placeComments/${placeId}`,
    });
    const $commentList = $modal.find('#commentList');
    for (comment of comments) {
        $comment = $(`
            <li>
                <span class="username">${comment.user}</span>:
                <span class="content">${comment.comment}</span>
                <button type="button" class="btn btn-primary" id="deleteBtn">
                    Delete
                </button>
            </li>`);
        $commentList.append($comment);
    }
    $('#editBtn').click(editPlace);
};

const editPlace = async () => {
    $('.description').attr('contenteditable', 'true');
    $('.placeAddress').attr('contenteditable', 'true');
    $('.placeZipCode').attr('contenteditable', 'true');
    $('.placePrice').attr('contenteditable', 'true');
    $('._displayTime').attr('contenteditable', 'true');
    $('.remainNum').attr('contenteditable', 'true');
    $('#editBtn').text('Save').click(saveEdit);
};

const saveEdit = async () => {
    $('#editBtn').text('Edit');
    const description = $('.description')
        .attr('contenteditable', 'false')
        .text();
    const placeAddress = $('.placeAddress')
        .attr('contenteditable', 'false')
        .text();
    const placeZipCode = $('.placeZipCode')
        .attr('contenteditable', 'false')
        .text();
    const placePrice = $('.placePrice')
        .attr({ contenteditable: 'false' })
        .text();
    const _displayTime = $('._displayTime')
        .attr({ contenteditable: 'false' })
        .text();
    const remainNum = $('.remainNum').attr('contenteditable', 'false').text();

    const placeId = $('#place').attr('data-id');

    await $.ajax({
        url: `http://localhost:3000/places/${placeId}`,
        type: 'PATCH',
        data: {
            newDescription: $.trim(description),
            newPlaceAddress: $.trim(placeAddress),
            newPlaceZipCode: $.trim(placeZipCode),
            newPlacePrice: $.trim(placePrice),
            newDisplayTime: $.trim(_displayTime),
            newRemainNum: $.trim(remainNum),
        },
    });
    await refreshPlaces();
};

const refreshPlaces = async () => {
    await fetchPlaces(store);
    renderPlaces(store['places']);
};

const fetchPlaces = async (store) => {
    store['places'] = await $.ajax({ url: 'http://localhost:3000/places/' });
};

const fetchUsers = async (store) => {
    store['users'] = await $.ajax({ url: 'http://localhost:3000/users/' });
};

const logout = async (event) => {
    event.preventDefault();
    await $.ajax({
        url: `http://localhost:3000/users/logout`,
    });
    window.location.replace('http://localhost:3000/sign-in-up.html');
};

const store = {};

const main = async () => {
    await fetchPlaces(store);
    renderPlaces(store['places']);
};

main();
