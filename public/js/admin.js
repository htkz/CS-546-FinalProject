const getPlaceById = (id) => {
    for (place of store['places']) {
        if (place._id === id) {
            return place;
        }
    }
    return undefined;
};

const renderPlaces = async (places) => {
    $('#cards').empty();

    for (place of places) {
        const card = $(`
            <div class="info" id=${place._id}>
                <div class="row">
                    <div class="col">
                        <img src="./pic/${place.images[0]}" class="img rounded mx-auto d-block" alt="${place.images[0]}" />
                    </div>
                    <div class="col-8 detail">
                        <div>
                            <b>Place Name</b>: <span class=placeName>${place.placeName}</span>
                        </div>
                        <div>
                            <button class="showHideImage"/>
                            <b>Images</b>: <span class="images">Array</span>
                            <div class="imageContainer">
                                <ul class="imageList" style="display: none;"></ul>
                                <button class="addImage" style="display: none;"/>
                            </div>
                        </div>
                        <div>
                            <b>Description</b>: <span class="description" contenteditable="false">${place.description}</span>
                        </div>
                        <div>
                            <b>Place Address</b>: <span class="placeAddress" contenteditable="false">${place.placeAddress}</span>
                        </div>
                        <div>
                            <b>Place Zipcode</b>: <span class="placeZipCode" contenteditable="false">${place.placeZipCode}</span>
                        </div>
                        <div>
                            <b>Place Price</b>: <span class="placePrice" contenteditable="false">${place.placePrice}</span>
                        </div>
                        <div>
                            <b>Display Time</b>: <span class="displayTime" contenteditable="false">${place.displayTime}</span>
                        </div>
                        <div>
                            <b>Tickets</b>: <span class="remainNum" contenteditable="false">${place.remainNum}</span>
                        </div>
                        <div>
                            <button class="showHideCategory"/>
                            <b>Category</b>: <span class="categories">Array</span>
                            <div class="categoryContainer">
                                <ul class="categoryList" style="display: none;"></ul>
                                <button class="addCategory" style="display: none;"/>
                            </div>
                        </div>
                        <div>
                            <button class="showHideComment"/>
                            <b>Comments</b>: <span class="comments">Array</span>
                            <div class="commentContainer">
                                <ul class="commentList" style="display: none;"></ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <button type="button" class="btn editBtn btn-secondary" id=${place._id}>
                        Edit
                    </button>
                    <button type="button" class="btn deleteBtn btn-primary" id=${place._id}>
                        Delete
                    </button>
                </div>
            </div>
        `);
        const comments = await $.ajax({
            url: `http://localhost:3000/places/placeComments/${place._id}`,
        });

        let i = 0;
        for (comment of comments) {
            com = $(`
                <li id=${comment._id}>
                    ${i}:
                    <span class="username"> ${comment.user}</span>:
                    <span class="content">${comment.comment}</span>
                    <button type="button" class="commentDeleteBtn">
                    </button>
                </li>`);
            i++;
            card.find('.commentList').append(com);
        }

        let x = 0;
        for (image of place.images) {
            im = $(`
                <li>
                    ${x}:
                    <span class="image"> ${image}</span>
                </li>
            `);
            x++;
            card.find(`.imageList`).append(im);
        }

        let y = 0;
        for (category of place.category) {
            cat = $(`
                <li>
                    ${y}:
                    <span class="category"> ${category}</span>
                </li>
            `);
            y++;
            card.find(`.categoryList`).append(cat);
        }

        card.find('.editBtn').click((event) => {
            editPlace(event);
        });
        card.find('.deleteBtn').click((event) => {
            deletePlace(event);
        });
        card.find('.showHideComment').click((event) => {
            showHideComment(event);
        });
        card.find('.showHideImage').click((event) => {
            showHideImage(event);
        });
        card.find('.showHideCategory').click((event) => {
            showHideCategory(event);
        });
        card.find('.commentDeleteBtn').click((event) => {
            commentDelete(event);
        });

        $('#cards').append(card);
    }
};

const deletePlace = async (event) => {
    const placeId = event.currentTarget.id;
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

let commentFlag = false;
let imageFlag = false;
let categoryFlag = false;

const showHideComment = async (event) => {
    const $commentList = $(event.currentTarget).parent().find('.commentList');

    if ($commentList.css('display') === 'none' && commentFlag === true) {
        commentFlag = false;
    }

    if ($commentList.css('display') === 'block' && commentFlag === false) {
        commentFlag = true;
    }

    if (!commentFlag) {
        $commentList.css('display', '');
        commentFlag = true;
    } else {
        $commentList.css('display', 'none');
        commentFlag = false;
    }
};

const showHideImage = async () => {
    const $imageList = $(event.currentTarget).parent().find('.imageList');

    if ($imageList.css('display') === 'none' && imageFlag === true) {
        imageFlag = false;
    }

    if ($imageList.css('display') === 'block' && imageFlag === false) {
        imageFlag = true;
    }

    if (!imageFlag) {
        $imageList.css('display', '');
        imageFlag = true;
    } else {
        $imageList.css('display', 'none');
        imageFlag = false;
    }
};

const showHideCategory = async () => {
    const $categoryList = $(event.currentTarget).parent().find('.categoryList');

    if ($categoryList.css('display') === 'none' && categoryFlag === true) {
        categoryFlag = false;
    }

    if ($categoryList.css('display') === 'block' && categoryFlag === false) {
        categoryFlag = true;
    }

    if (!categoryFlag) {
        $categoryList.css('display', '');
        categoryFlag = true;
    } else {
        $categoryList.css('display', 'none');
        categoryFlag = false;
    }
};

const editPlace = async (event) => {
    const root = $(event.currentTarget).parent().parent();
    root.find('.placeName').attr('contenteditable', 'true');
    root.find('.description').attr('contenteditable', 'true');
    root.find('.placeAddress').attr('contenteditable', 'true');
    root.find('.placeZipCode').attr('contenteditable', 'true');
    root.find('.placePrice').attr('contenteditable', 'true');
    root.find('.displayTime').attr('contenteditable', 'true');
    root.find('.remainNum').attr('contenteditable', 'true');
    root.find('.category').attr('contenteditable', 'true');
    root.find('.image').attr('contenteditable', 'true');
    root.find('.addImage').css('display', '');
    root.find('.addCategory').css('display', '');

    root.find('.addImage').click((event) => {
        addImage(root);
    });

    root.find('.addCategory').click((event) => {
        addCategory(root);
    });

    $(event.currentTarget)
        .parent()
        .find('.editBtn')
        .text('Save')
        .click((event) => {
            saveEdit(event);
        });
};

const saveEdit = async (event) => {
    $(event.currentTarget).parent().find('.editBtn').text('Edit');

    const root = $(event.currentTarget).parent().parent();
    const placeId = event.currentTarget.id;

    const placeName = root
        .find('placeName')
        .attr('contenteditable', 'false')
        .text();
    const description = root
        .find('.description')
        .attr('contenteditable', 'false')
        .text();
    const placeAddress = root
        .find('.placeAddress')
        .attr('contenteditable', 'false')
        .text();
    const placeZipCode = root
        .find('.placeZipCode')
        .attr('contenteditable', 'false')
        .text();
    const placePrice = root
        .find('.placePrice')
        .attr({ contenteditable: 'false' })
        .text();
    const displayTime = root
        .find('.displayTime')
        .attr({ contenteditable: 'false' })
        .text();
    const remainNum = root
        .find('.remainNum')
        .attr('contenteditable', 'false')
        .text();
    let categories = root
        .find('.category')
        .attr('contenteditable', 'false')
        .text();
    categories = $.trim(categories).replace(/\s/g, ',');
    let images = root.find('.image').attr('contenteditable', 'false').text();
    images = $.trim(images).replace(/\s/g, ',');

    console.log(images);

    await $.ajax({
        url: `http://localhost:3000/places/${placeId}`,
        type: 'PATCH',
        data: {
            newPlaceName: $.trim(placeName),
            newDescription: $.trim(description),
            newPlaceAddress: $.trim(placeAddress),
            newPlaceZipCode: $.trim(placeZipCode),
            newPlacePrice: $.trim(placePrice),
            newCategory: $.trim(categories),
            newDisplayTime: $.trim(displayTime),
            newRemainNum: $.trim(remainNum),
            newImages: $.trim(images),
        },
    });
    await refreshPlaces(event);
};

const addCategory = async (root) => {
    cat = $(`
        <li>
            +:
            <span class="category" contenteditable="true"> Default</span>
        </li>
    `);
    root.find(`.categoryList`).append(cat);
};

const addImage = async (root) => {
    image = $(`
        <li>
            +:
            <span class="image" contenteditable="true"> Default.jpg</span>
        </li>
    `);
    root.find(`.imageList`).append(image);
};

const commentDelete = async (event) => {
    commentId = $(event.currentTarget).parent()[0].id;
    await deleteComment(commentId);
    $(event.currentTarget).parent().remove();
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

const deleteComment = async (id) => {
    try {
        await $.ajax({
            url: `http://localhost:3000/comments/${id}`,
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

const renderUsers = async (users) => {
    $('#cards').empty();
    console.log(users);

    for (user of users) {
        const card = $(`
            <div class="info" id=${user._id}>
                <div class="detail">
                    <div>
                        <b>User Name</b>: <span class=userName>${user.userName}</span>
                    </div>
                    <div>
                        <b>Email</b>: <span class=email>${user.email}</span>
                    </div>
                    <div>
                        <b>Phone Number</b>: <span class="phoneNumber" contenteditable="false">${user.phoneNumber}</span>
                    </div>
                    <div>
                        <b>Address</b>: <span class="address" contenteditable="false">${user.address}</span>
                    </div>
                    <div>
                        <b>Zipcode</b>: <span class="zipCode" contenteditable="false">${user.zipCode}</span>
                    </div>
                    <div>
                        <b>Password</b>: <span class="password" contenteditable="false">${user.hashedPassword}</span>
                    </div>
                    <div>
                        <b>Bio</b>: <span class="bio" contenteditable="false">${user.bio}</span>
                    </div>
                    <div>
                        <button class="showHideTicket"/>
                        <b>Ticket Infomation</b>: <span class="userTicketInfo">Array</span>
                        <div class="userTicketInfoContainer">
                            <ul class="userTicketInfoList" style="display: none;"></ul>
                        </div>
                    </div>
                    <div>
                        <button class="showHideUserComments"/>
                        <b>Comments</b>: <span class="userComments">Array</span>
                        <div class="userCommentContainer">
                            <ul class="userCommentsList" style="display: none;"></ul>
                        </div>
                    </div>
                    <div>
                        <button class="showHideFriends"/>
                        <b>Friends</b>: <span class="friends">Array</span>
                        <div class="friendContainer">
                            <ul class="friendsList" style="display: none;"></ul>
                        </div>
                    </div>
                    <div>
                        <b>Bank Card</b>: <span class="bankCard" contenteditable="false">${user.bankCard}</span>
                    </div>
                </div>
                <div class="bottom">
                    <button type="button" class="btn editBtn btn-secondary" id=${user._id}>
                        Edit
                    </button>
                    <button type="button" class="btn deleteBtn btn-primary" id=${user._id}>
                        Delete
                    </button>
                </div>
            </div>
        `);

        let i = 0;
        for (ticketId of user.userTicketInfo) {
            const ticket = await $.ajax({
                url: `http://localhost:3000/tickets/${ticketId}`,
            });
            t = $(`
                <li id=${ticket._id}>
                    ${i}:
                    <span> ${ticket.ticketNo}</span>
                </li>
            `);
            i++;
        }

        let x = 0;
        for (commentId of user.userComments) {
            const comment = await $.ajax({
                url: `http://localhost:3000/comments/${commentId}`,
            });
            c = $(`
                <li id=${comment._id}>
                    ${x}:
                    <span> ${comment}</span>
                </li>
            `);
            x++;
        }

        let y = 0;
        for (friendId of user.friends) {
            const friend = await $.ajax({
                url: `http://localhost:3000/friends/${friendId}`,
            });
            f = $(`
                <li id=${friend._id}>
                    ${y}:
                    <span> ${friend}</span>
                </li>
            `);
            y++;
        }

        card.find('.deleteBtn').click((event) => {
            deleteUser(event);
        });
        card.find('.showHideTicket').click((event) => {
            showHideTicket(event);
        });
        card.find('.showHideUserComments').click((event) => {
            showHideUserComment(event);
        });
        card.find('.showHideFriends').click((event) => {
            showHideFriend(event);
        });

        $('#cards').append(card);
    }
};

let friendFlag = false;
let ticketFlag = false;
let userCommentFlag = false;

const showHideTicket = async () => {
    const $ticketList = $(event.currentTarget)
        .parent()
        .find('.userTicketInfoList');

    if ($ticketList.css('display') === 'none' && ticketFlag === true) {
        ticketFlag = false;
    }

    if ($categoryList.css('display') === 'block' && ticketFlag === false) {
        ticketFlag = true;
    }

    if (!ticketFlag) {
        $ticketList.css('display', '');
        ticketFlag = true;
    } else {
        $ticketList.css('display', 'none');
        ticketFlag = false;
    }
};

const showHideFriend = async () => {
    const $friendList = $(event.currentTarget).parent().find('.friendsList');

    if ($friendList.css('display') === 'none' && friendFlag === true) {
        friendFlag = false;
    }

    if ($friendList.css('display') === 'block' && friendFlag === false) {
        friendFlag = true;
    }

    if (!friendFlag) {
        $friendList.css('display', '');
        friendFlag = true;
    } else {
        $friendList.css('display', 'none');
        friendFlag = false;
    }
};

const showHideUserComment = async () => {
    const $userCommentList = $(event.currentTarget)
        .parent()
        .find('.userCommentsList');

    if (
        $userCommentList.css('display') === 'none' &&
        userCommentFlag === true
    ) {
        userCommentFlag = false;
    }

    if (
        $userCommentList.css('display') === 'block' &&
        userCommentFlag === false
    ) {
        userCommentFlag = true;
    }

    if (!userCommentFlag) {
        $userCommentList.css('display', '');
        userCommentFlag = true;
    } else {
        $userCommentList.css('display', 'none');
        userCommentFlag = false;
    }
};

const deleteUser = async (event) => {
    const id = event.currentTarget.id;
    try {
        await $.ajax({
            url: `http://localhost:3000/users/${id}`,
            type: 'DELETE',
        });
    } catch (error) {
        alert(error);
        console.log(error);
    }
};

const fetchUsers = async (store) => {
    store['users'] = await $.ajax({ url: 'http://localhost:3000/users/' });
};

const filterBySearch = (tag) => {
    if (tag.length === 0) {
        renderPlaces(store['places']);
        return;
    }
    const places = [];
    for (place of store['places']) {
        for (cat of place.category) {
            if (cat.toLowerCase() === tag.toLowerCase()) {
                places.push(place);
                break;
            }
        }
    }
    renderPlaces(places);
};

const logout = async (event) => {
    event.preventDefault();
    await $.ajax({
        url: `http://localhost:3000/users/logout`,
    });
    window.location.replace('http://localhost:3000/entry');
};

const bindEvents = async () => {
    $('.float-button').click((event) => {
        addForm();
        $('#addDetailModal').modal('show');
    });
    $('#userBtn').click((event) => {
        renderUsers(store['users']);
    });
    $('#placeBtn').click((event) => {
        renderPlaces(store['places']);
    });
    $('#search').submit((event) => {
        event.preventDefault();
        filterBySearch($('#searchInput').val());
    });
    $('#logoutBtn').click(logout);
};

const store = {};

const main = async () => {
    await fetchPlaces(store);
    await fetchUsers(store);
    renderPlaces(store['places']);
    bindEvents();
};

main();
