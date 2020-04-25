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
            </div>
        `);
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
                    <button type="button" class="btn btn-secondary" id="editBtn">
                        Edit
                    </button>
                    <button type="button" class="btn btn-primary" id="deleteBtn">
                        Delete
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
    $('#deleteBtn').click(deletePlace);
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

const addForm = async () => {
    $('#addDetailModal').empty();

    const $modal = $(`
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <H1>Add Place</p>
                </div>
                <div class="modal-body">
                    <div class="addPalceDetail">
                        <form id="form-addPlace" class="form-addPlace">
                            <label for="addPlaceName">
                                Place Name
                            </label>
                            <input type="text" id="addPlaceName" class="form-control" placeholder="Place Name" value="Feng"></input>
                            
                            <label for="addDescription">
                                Description
                            </label>
                            <textarea type="text" id="addDescription" class="form-control" placeholder="Description">Feng</textarea>
                            
                            <label for="addPlaceAddress">
                                Place Address
                            </label>
                            <input type="text" id="addPlaceAddress" class="form-control" placeholder="Place Address" value="Feng"></input>
                            
                            <label for="addPlaceZipCode">
                                Place Zipcode
                            </label>
                            <input type="text" id="addPlaceZipCode" class="form-control" placeholder="Place Address" value="07302"></input>

                            <label for="addPlacePrice">
                                Place Price
                            </label>
                            <input type="text" id="addPlacePrice" class="form-control" placeholder="Place Price" value=200></input>
                            
                            <label for="addCategory">
                                Category
                            </label>
                            <input type="text" id="addCategory" class="form-control" placeholder="Category" value="Feng, Love"></input>
                            
                            <label for="addDisplayTime">
                                Display Time
                            </label>
                            <input type="date" name="addDisplayTime" id="addDisplayTime" class="form-control" value="2020-03-05"></input>
                            
                            <label for="addRemainNum">
                                Remain Number
                            </label>
                            <input type="text" id="addRemainNum" class="form-control" placeholder="Remain Number" value=100></input>
                            
                            <label for="addImages">
                                Images
                            </label>
                            <input type="text" id="addImages" class="form-control" placeholder="Images" value="NASA.jpg"></input>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" id="save">Add</button>
                    </div>
                </div>
            </div>
        </div>
    `);

    $('#addDetailModal').append($modal);
    $('#save').click(addPlace);
};

const addPlace = async () => {
    const placeName = $('#addPlaceName').val();
    const description = $('#addDescription').val();
    const placeAddress = $('#addPlaceAddress').val();
    const placeZipCode = $('#addPlaceZipCode').val();
    const placePrice = $('#addPlacePrice').val();
    const category = $('#addCategory').val();
    const displayTime = $('#addDisplayTime').val();
    const remainNum = $('#addRemainNum').val();
    const images = $('#addImages').val();

    try {
        await $.ajax({
            url: 'http://localhost:3000/places/',
            type: 'POST',
            data: {
                placeName: $.trim(placeName),
                description: $.trim(description),
                placeAddress: $.trim(placeAddress),
                placeZipCode: $.trim(placeZipCode),
                placePrice: $.trim(placePrice),
                category: $.trim(category),
                displayTime: $.trim(displayTime),
                remainNum: $.trim(remainNum),
                images: $.trim(images),
            },
        });
        $('#addDetailModal').modal('hide');
        await refreshPlaces();
    } catch (error) {
        alert(error);
        console.log(error);
    }
};

const deletePlace = async () => {
    const placeId = $('#place').attr('data-id');
    try {
        await $.ajax({
            url: `http://localhost:3000/places/${placeId}`,
            type: 'DELETE',
        });
        $('#detailModal').modal('hide');
        await refreshPlaces();
    } catch (error) {
        alert(error);
        console.log(error);
    }
};

const deleteUser = async () => {
    try {
        let id = event.currentTarget.id;
        console.log(id);
        await $.ajax({
            url: `http://localhost:3000/users/id`,
            type: 'DELETE',
        });
    } catch (error) {
        alert(error);
        console.log(error);
    }
};

const deleteComment = async () => {
    try {
        console.log(id);
        await $.ajax({
            url: `http://localhost:3000/comments/id`,
            type: 'DELETE',
        });
    } catch (error) {
        alert(error);
        console.log(error);
    }
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

const bindEvents = async () => {
    $('.float-button').click((event) => {
        addForm();
        $('#addDetailModal').modal('show');
    });
};

const store = {};

const main = async () => {
    await fetchPlaces(store);
    renderPlaces(store['places']);
    bindEvents();
};

main();
