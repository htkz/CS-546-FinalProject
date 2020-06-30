currentPlaceId = undefined;
currentUserId = undefined;

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

const showSwal = async (icon, title) => {
    await Swal.fire({
        icon: icon,
        title: title,
        showConfirmButton: false,
        timer: 1500,
    });
};

const getPlaceById = (id) => {
    for (place of store['places']) {
        if (place._id === id) {
            return place;
        }
    }
    return undefined;
};

const updatePassword = async (event) => {
    const password = $('#edit-password').val();
    try {
        await $.ajax({
            url: `/users/admin/password/${currentUserId}`,
            type: 'put',
            data: {
                password: password,
            },
        });
        await showSwal('success', 'Already changed password!');
    } catch (error) {
        await showSwal('error', 'Cannot change password!');
    }
};

const renderPlaceEditModal = async (placeId) => {
    const place = await $.ajax(`/places/${placeId}`);
    $('#edit-palceName').val(place.placeName);
    $('#edit-description').val(place.description);
    $('#edit-address').val(place.placeAddress);
    $('#edit-zipcode').val(place.placeZipCode);
    $('#edit-price').val(place.placePrice);
    $('#edit-displayTime').val(place.displayTime);
    $('#edit-remainNum').val(place.remainNum);
    $('#edit-category').val(place.category.join(','));
};

const updatePlace = async () => {
    const placeData = {
        newPlaceName: $('#edit-palceName').val(),
        newDescription: $('#edit-description').val(),
        newPlaceAddress: $('#edit-address').val(),
        newPlaceZipCode: $('#edit-zipcode').val(),
        newPlacePrice: $('#edit-price').val(),
        newDisplayTime: $('#edit-displayTime').val(),
        newRemainNum: $('#edit-remainNum').val(),
        newCategory: $('#edit-category').val(),
    };
    try {
        await $.ajax({
            url: `places/${currentPlaceId}`,
            type: 'patch',
            data: placeData,
        });
        await showSwal('success', 'Update palce successfully!');
    } catch (error) {
        await showSwal('error', error);
    }
};

const showPlaceEditModal = (event) => {
    console.log($(event.currentTarget));
    const placeId = $(event.currentTarget).data('id');
    currentPlaceId = placeId;
    renderPlaceEditModal(placeId);
    $('#editDetailModal').modal('show');
};

const renderPlaces = async (places) => {
    $('#cards').empty();

    for (place of places) {
        const card = $(`
            <div class="info" id=${place._id}>
                <div class="row">
                    <div class="col imgContainer">
                        <img src="./pic/places/${place.images[0]}" class="img rounded mx-auto d-block" alt="${place.images[0]}" />
                    </div>
                    <div class="col-8 detail">
                        <div>
                            <b>Place Name</b>: <span class=placeName>${place.placeName}</span>
                        </div>
                        <div>
                            <div class='showHideImage tirangle'><img src='./pic/triangle_right.png' /></div>
                            <b>Images</b>: <span class="images">Array</span>
                            <div class="imageContainer">
                                <ul class="imageList" style="display: none;"></ul>
                                <button class="addImage" style="display: none;"/>
                            </div>
                        </div>
                        <div>
                            <b>Description</b>: <span class="description">${place.description}</span>
                        </div>
                        <div>
                            <b>Place Address</b>: <span class="placeAddress">${place.placeAddress}</span>
                        </div>
                        <div>
                            <b>Place Zipcode</b>: <span class="placeZipCode">${place.placeZipCode}</span>
                        </div>
                        <div>
                            <b>Place Price</b>: <span class="placePrice">${place.placePrice}</span>
                        </div>
                        <div>
                            <b>Display Time</b>: <span class="displayTime">${place.displayTime}</span>
                        </div>
                        <div>
                            <b>Tickets</b>: <span class="remainNum">${place.remainNum}</span>
                        </div>
                        <div>
                            <div class='showHideCategory tirangle'><img src='./pic/triangle_right.png' /></div>
                            <b>Category</b>: <span class="categories">Array</span>
                            <div class="categoryContainer">
                                <ul class="categoryList" style="display: none;"></ul>
                                <button class="addCategory" style="display: none;"/>
                            </div>
                        </div>
                        <div>
                            <div class='showHideComment tirangle'><img src='./pic/triangle_right.png' /></div>
                            <b>Comments</b>: <span class="comments">Array</span>
                            <div class="commentContainer">
                                <ul class="commentList" style="display: none;"></ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <button type="button" class="btn editBtn btn-secondary" data-id=${place._id}>
                        Edit
                    </button>
                    <button type="button" class="btn deleteBtn btn-primary" data-id=${place._id}>
                        Delete
                    </button>
                </div>
            </div>
        `);
        const comments = await $.ajax({
            url: `/places/placeComments/${place._id}`,
        });

        comments.forEach((comment, index) => {
            com = $(`
                <li id=${comment._id}>
                    ${index}:
                    <span class="username"> ${comment.userName}</span>:
                    <span class="content">${comment.comment}</span>
                    <button type="button" class="commentDeleteBtn">
                    </button>
                </li>`);
            card.find('.commentList').append(com);
        });

        place.images.forEach((image, index) => {
            im = $(`
                <li>
                    ${index}:
                    <span class="image"> ${image}</span>
                </li>
            `);
            card.find(`.imageList`).append(im);
        });

        place.category.forEach((category, index) => {
            cat = $(`
                <li>
                    ${index}:
                    <span class="category"> ${category}</span>
                </li>
            `);
            card.find(`.categoryList`).append(cat);
        });

        card.find('.editBtn').click((event) => {
            showPlaceEditModal(event);
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
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this place?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0d7eb1',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
    });
    if (result.value) {
        const placeId = $(event.currentTarget).data('id');
        try {
            await $.ajax({
                url: `/places/${placeId}`,
                type: 'DELETE',
            });
            $('#detailModal').modal('hide');
            await refreshPlaces();
        } catch (error) {
            alert(error);
            console.log(error);
        }
    }
};

let commentFlag = false;
let imageFlag = false;
let categoryFlag = false;

const showHideComment = async (event) => {
    const $commentList = $(event.currentTarget).parent().find('.commentList');
    if ($commentList.css('display') === 'none') {
        $commentList.css('display', 'block');
        $(event.currentTarget)
            .find('img')
            .attr('src', './pic/triangle_down.png');
    } else {
        $commentList.css('display', 'none');
        $(event.currentTarget)
            .find('img')
            .attr('src', './pic/triangle_right.png');
    }
};

const showHideImage = async () => {
    const $imageList = $(event.currentTarget).parent().find('.imageList');
    if ($imageList.css('display') === 'none') {
        $imageList.css('display', 'block');
        $(event.currentTarget)
            .find('img')
            .attr('src', './pic/triangle_down.png');
    } else {
        $imageList.css('display', 'none');
        $(event.currentTarget)
            .find('img')
            .attr('src', './pic/triangle_right.png');
    }
};

const showHideCategory = async () => {
    const $categoryList = $(event.currentTarget).parent().find('.categoryList');
    if ($categoryList.css('display') === 'none') {
        $categoryList.css('display', 'block');
        $(event.currentTarget)
            .find('img')
            .attr('src', './pic/triangle_down.png');
    } else {
        $categoryList.css('display', 'none');
        $(event.currentTarget)
            .find('img')
            .attr('src', './pic/triangle_right.png');
    }
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
        url: `/places/${placeId}`,
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
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this comment?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0d7eb1',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
    });
    if (result.value) {
        commentId = $(event.currentTarget).parent()[0].id;
        await deleteComment(commentId);
        await showSwal('success', 'Already delete comment!');
        $(event.currentTarget).parent().remove();
    }
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
            url: '/places/',
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
            url: `/comments/${id}`,
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
    store['places'] = await $.ajax({ url: '/places/' });
};

const renderUsers = async (users) => {
    $('#cards').empty();

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
                        <b>Gender</b>: <span class=gender>${user.gender}</span>
                    </div>
                    <div>
                        <b>Birth Date</b>: <span class=birthdate>${user.birthDate}</span>
                    </div>
                    <div>
                        <b>Phone Number</b>: <span class="phoneNumber">${user.phoneNumber}</span>
                    </div>
                    <div>
                        <b>Address</b>: <span class="address">${user.address}</span>
                    </div>
                    <div>
                        <b>Zipcode</b>: <span class="zipCode">${user.zipCode}</span>
                    </div>
                    <div>
                        <b>Password</b>: <span class="password">${user.hashedPassword}</span>
                    </div>
                    <div>
                        <b>Bio</b>: <span class="bio">${user.bio}</span>
                    </div>
                    <div>
                        <div class='showHideTicket tirangle'><img src='./pic/triangle_right.png' /></div>
                        <b>Ticket Infomation</b>: <span class="userTicketInfo">Array</span>
                        <div class="userTicketInfoContainer">
                            <ul class="userTicketInfoList" style="display: none;"></ul>
                        </div>
                    </div>
                    <div>
                        <div class='showHideUserComments tirangle'><img src='./pic/triangle_right.png' /></div>
                        <b>Comments</b>: <span class="userComments">Array</span>
                        <div class="userCommentContainer">
                            <ul class="userCommentsList" style="display: none;"></ul>
                        </div>
                    </div>
                    <div>
                        <div class='showHideFriends tirangle'><img src='./pic/triangle_right.png' /></div>
                        <b>Friends</b>: <span class="friends">Array</span>
                        <div class="friendContainer">
                            <ul class="friendsList" style="display: none;"></ul>
                        </div>
                    </div>
                    <div>
                        <b>Bank Card</b>: <span class="bankCard">${user.bankCard}</span>
                    </div>
                </div>
                <div class="bottom">
                    <button type="button" class="btn editBtn btn-secondary" data-id=${user._id}>
                        Edit
                    </button>
                    <button type="button" class="btn btn-secondary" id='changePasswordBtn' data-id=${user._id}>
                        Password
                    </button>
                    <button type="button" class="btn deleteBtn btn-primary" id=${user._id}>
                        Delete
                    </button>
                </div>
            </div>
        `);
        await asyncForEach(user.userTicketInfo, async (ticketId, index) => {
            const ticket = await $.ajax({
                url: `/tickets/${ticketId}`,
            });
            $ticket = $(`
            <li id=${ticket._id}>
                ${index}:
                <span> ${ticket.ticketNo}</span>
            </li>`);
            card.find('.userTicketInfoList').append($ticket);
        });

        await asyncForEach(user.userComments, async (commentId, index) => {
            const comment = await $.ajax({
                url: `/comments/${commentId}`,
            });
            $comment = $(`
            <li id=${comment._id}>
                ${index}:
                <span> ${comment.comment}</span> 
                <button class="commentDeleteBtn"}></button>
            </li>`);
            card.find('.userCommentsList').append($comment);
        });

        await asyncForEach(user.friends, async (friendId, index) => {
            const friend = await $.ajax({
                url: `/friends/${friendId}`,
            });
            $friend = $(`
            <li id=${friend._id}>
                ${index}:
                <span> ${friend.name}</span>
            </li>`);
            card.find('.friendsList').append($friend);
        });

        card.find('.editBtn').click((event) => {
            showUserEditModal(event);
        });
        card.find('.deleteBtn').click((event) => {
            deleteUser(event);
        });
        card.find('#changePasswordBtn').click((event) => {
            showPasswordEditModal(event);
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
        card.find('.commentDeleteBtn').click((event) => {
            commentDelete(event);
        });

        $('#cards').append(card);
    }
};

let friendFlag = false;
let ticketFlag = false;
let userCommentFlag = false;

const showHideTicket = async () => {
    const $userTicketInfoList = $(event.currentTarget)
        .parent()
        .find('.userTicketInfoList');
    if ($userTicketInfoList.css('display') === 'none') {
        $userTicketInfoList.css('display', 'block');
        $(event.currentTarget)
            .find('img')
            .attr('src', './pic/triangle_down.png');
    } else {
        $userTicketInfoList.css('display', 'none');
        $(event.currentTarget)
            .find('img')
            .attr('src', './pic/triangle_right.png');
    }
};

const showHideFriend = async () => {
    const $friendsList = $(event.currentTarget).parent().find('.friendsList');
    if ($friendsList.css('display') === 'none') {
        $friendsList.css('display', 'block');
        $(event.currentTarget)
            .find('img')
            .attr('src', './pic/triangle_down.png');
    } else {
        $friendsList.css('display', 'none');
        $(event.currentTarget)
            .find('img')
            .attr('src', './pic/triangle_right.png');
    }
};

const showHideUserComment = async () => {
    const $userCommentList = $(event.currentTarget)
        .parent()
        .find('.userCommentsList');
    if ($userCommentList.css('display') === 'none') {
        $userCommentList.css('display', 'block');
        $(event.currentTarget)
            .find('img')
            .attr('src', './pic/triangle_down.png');
    } else {
        $userCommentList.css('display', 'none');
        $(event.currentTarget)
            .find('img')
            .attr('src', './pic/triangle_right.png');
    }
};

const deleteUser = async (event) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this user?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0d7eb1',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
    });
    if (result.value) {
        const id = event.currentTarget.id;
        console.log(id);
        try {
            await $.ajax({
                url: `/users/${id}`,
                type: 'DELETE',
            });
        } catch (error) {
            alert(error);
            console.log(error);
        }
    }
};

const fetchUsers = async (store) => {
    store['users'] = await $.ajax({ url: '/users/' });
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

const showUserEditModal = (event) => {
    const userId = $(event.currentTarget).data('id');
    currentUserId = userId;
    renderUserEditModal(userId);
    $('#editUserDetailModal').modal('show');
};

const showPasswordEditModal = (event) => {
    console.log('123');
    const userId = $(event.currentTarget).data('id');
    currentUserId = userId;
    $('#passwordEditModal').modal('show');
};

const renderUserEditModal = async (userId) => {
    const user = await $.ajax(`/users/account/${userId}`);
    console.log(user);
    $('#edit-userName').val(user.userName);
    $('#edit-email').val(user.email);
    $('#edit-phoneNumber').val(user.phoneNumber);
    $('#edit-userAddress').val(user.address);
    $('#edit-userZipCode').val(user.zipCode);
    $('#edit-password').val(user.hashedPassword);
    $('#edit-userBio').val(user.bio);
    $('#edit-bankCard').val(user.bankCard);
    $('#edit-gender').val(user.gender);
    $('#edit-birthDate').val(user.birthDate);
};

const updateUser = async () => {
    const userData = {
        userName: $('#edit-userName').val(),
        email: $('#edit-email').val(),
        phoneNumber: $('#edit-phoneNumber').val(),
        address: $('#edit-userAddress').val(),
        zipCode: $('#edit-userZipCode').val(),
        bio: $('#edit-userBio').val(),
        gender: $('#edit-gender').val(),
        birthDate: $('#edit-birthDate').val(),
    };
    try {
        await $.ajax({
            url: `users/account/update/${currentUserId}`,
            type: 'put',
            data: userData,
        });
        await showSwal('success', 'Update user successfully!');
    } catch (error) {
        await showSwal('error', error);
    }
};

const logout = async (event) => {
    event.preventDefault();
    await $.ajax({
        url: `/users/logout`,
    });
    window.location.replace('/entry');
};

const bindEvents = async () => {
    $('.float-button').click((event) => {
        addForm();
        $('#addDetailModal').modal('show');
    });
    $('#userBtn').click(async (event) => {
        await fetchUsers(store);
        renderUsers(store['users']);
    });
    $('#placeBtn').click(async (event) => {
        await fetchPlaces(store);
        renderPlaces(store['places']);
    });
    $('#updatePlaceBtn').click(updatePlace);
    $('#updateUserBtn').click(updateUser);
    $('#updatePasswordBtn').click(updatePassword);
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
