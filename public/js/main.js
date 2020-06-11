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
    const place = getPlaceById(placeId);
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
    await renderComment(placeId);
    $('#commentForm').submit(postComment);

    if (place.remainNum === '0' || place.remainNum === 0) {
        $('#buyBtn').click(() => {
            Swal.fire({
                icon: 'error',
                title: 'Sorry, this ticket is sold out!',
                showConfirmButton: false,
                timer: 1500,
            });
        });
    } else {
        $('#buyBtn').click(() => {
            $('#buyTicketModal').modal('show');
        });
        $('#buyTicketForm').submit(buyTicket);
    }
    const date = place.displayTime.split('-');
    const year = parseInt(date[0]);
    const month = date[1];
    const day = date[2];
    $('#dateInput').attr('max', `${year + 1}-${month}-${day}`);
    $('#dateInput').attr('min', place.displayTime);
    $('#dateInput').val(place.displayTime);
    $('#carousel').carousel();
};

const renderComment = async (placeId) => {
    const comments = await $.ajax({
        url: `/places/placeComments/${placeId}`,
    });
    const $commentList = $('#commentList');
    $commentList.empty();
    const userId = userInfo['_id'];
    for (comment of comments) {
        const id = comment['_id'];
        $comment = $(`
            <li data-id=${id}>
                <span class="username">${comment.user}</span>:
                <span class="content">${comment.comment}</span>
                <div class="voteIcons">
                    <div class="upvote">
                        <i class="upvoteIcon"></i>
                        <span class="upvoteCount">${comment.upVotedUsers.length}<span>
                    </div>
                    <div class="downvote">
                        <i class="downvoteIcon"></i>
                        <span class="downvoteCount">${comment.downVotedUsers.length}<span>
                    </div>
                </div>
            </li>`);
        if (comment.upVotedUsers.includes(userId)) {
            $comment.find('.voteIcons').addClass('upvote');
        }
        if (comment.downVotedUsers.includes(userId)) {
            $comment.find('.voteIcons').addClass('downvote');
        }
        $commentList.append($comment);
        $comment.find('.upvoteIcon').click(async (event) => {
            const $voteIcons = $(event.currentTarget).parent().parent();
            const classes = $voteIcons.attr('class');
            const isUpvoted = classes.includes('upvote');
            const isDownvoted = classes.includes('downvote');
            const commentId = $voteIcons.parent().data('id');
            const action = isUpvoted ? 'cancelupvote' : 'upvote';
            await $.ajax({
                url: `comments/${action}/${commentId}`,
                type: 'PUT',
                data: {
                    votedUserId: userId,
                },
            });
            if (isDownvoted) {
                await $.ajax({
                    url: `comments/canceldownvote/${commentId}`,
                    type: 'PUT',
                    data: {
                        votedUserId: userId,
                    },
                });
            }
            const placeId = $('#place').data('id');
            await renderComment(placeId);
            $voteIcons.toggleClass('upvote').removeClass('downvote');
        });
        $comment.find('.downvoteIcon').click(async (event) => {
            const $voteIcons = $(event.currentTarget).parent().parent();
            const classes = $voteIcons.attr('class');
            const isUpvoted = classes.includes('upvote');
            const isDownvoted = classes.includes('downvote');
            const commentId = $voteIcons.parent().data('id');
            const action = isDownvoted ? 'canceldownvote' : 'downvote';
            await $.ajax({
                url: `comments/${action}/${commentId}`,
                type: 'PUT',
                data: {
                    votedUserId: userId,
                },
            });
            if (isUpvoted) {
                await $.ajax({
                    url: `comments/cancelupvote/${commentId}`,
                    type: 'PUT',
                    data: {
                        votedUserId: userId,
                    },
                });
            }
            const placeId = $('#place').data('id');
            await renderComment(placeId);
            $voteIcons.toggleClass('downvote').removeClass('upvote');
        });
    }
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

const renderUser = async () => {
    $('#username').text(userInfo['userName']);
    const friends = await $.ajax(`/users/friends/${userInfo['_id']}`);
    friends.forEach((friend) => {
        $friend = $(
            `<span class="friendBtn" data-id="${friend['_id']}">${friend.name}</span>`
        );
        $('.friendsContainer').append($friend);
        $friend.click((event) => {
            $(event.currentTarget).toggleClass('active');
        });
    });
    $('#yourselfBtn').click(() => {
        $(event.currentTarget).toggleClass('active');
    });
};

const refreshPlaces = async () => {
    await fetchPlaces(store);
};

const refreshComment = async (placeId) => {
    const comments = await $.ajax({
        url: `/places/placeComments/${placeId}`,
    });
    const $commentList = $('#commentList');
    $commentList.empty();
    for (comment of comments) {
        $comment = $(`
            <li>
                <span class="username">${comment.user}</span>:
                <span class="content">${comment.comment}</span>
            </li>`);
        $commentList.append($comment);
    }
};

const refreshTicket = async (placeId) => {
    const place = await $.ajax({
        url: `/places/${placeId}`,
    });
    const curNum = place.remainNum;
    $('#ticketRemainNum').text(curNum);
    const curPlace = getPlaceById(placeId);
    curPlace.remainNum = curNum;
    renderPlaces(store['places']);
};

const postComment = async (event) => {
    event.preventDefault();
    const comment = $('#commentInput').val();
    if (comment.length === 0) {
        return;
    }
    const placeId = $('#place').attr('data-id');
    const userId = userInfo['_id'];
    await $.ajax({
        url: '/comments/',
        type: 'POST',
        data: {
            user: userId,
            placeId: placeId,
            comment: comment,
        },
    });
    $('#commentInput').val('');
    await refreshPlaces();
    await refreshComment(placeId);
    $('#commentList').animate(
        {
            scrollTop: '99999',
        },
        500
    );
};

const buyTicket = async (event) => {
    event.preventDefault();
    const date = $('#dateInput').val();
    if (date.length === 0) {
        await Swal.fire({
            icon: 'error',
            title: 'Please select a time first!',
            timer: 1500,
        });
        return;
    }
    const friends = [];
    $('.myFriends')
        .find('span.active')
        .each((index, friend) => {
            friends.push($(friend).attr('data-id'));
        });
    const myself = !!($('.yourself').find('span.active').length !== 0);
    if (friends.length === 0 && !myself) {
        await Swal.fire({
            icon: 'error',
            title: 'Please select at least one person!',
            timer: 1500,
        });
        return;
    }
    let text = `You will reserve the ticket for: `;
    $('#buyTicketModal')
        .find('span.active')
        .each((index, buyer) => {
            text += $(buyer).text().trim() + ', ';
        });
    text = text.substr(0, text.length - 2) + '.';

    const result = await Swal.fire({
        title: 'Are you sure?',
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0d7eb1',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, buy it!',
        timer: 1500,
    });
    if (result.value) {
        try {
            const placeId = $('#place').attr('data-id');
            const userId = userInfo['_id'];
            const placeInfo = getPlaceById(placeId);
            const date = new Date();
            const orderDate = `${date.getFullYear()}-${
                date.getMonth() + 1
            }-${date.getDate()}`;
            const effectDate = $('#dateInput').val();
            const persons = {
                user: myself ? userId : '',
                friends: friends,
            };
            await $.ajax({
                url: '/tickets/',
                type: 'POST',
                data: {
                    persons: persons,
                    placeId: placeId,
                    orderedDate: orderDate,
                    effectDate: effectDate,
                    price: placeInfo.placePrice,
                },
            });

            await Swal.fire({
                icon: 'success',
                title: 'Your have already got the ticket!',
                showConfirmButton: false,
                timer: 1500,
            });
            refreshTicket(placeId);
            $('#buyTicketModal').modal('hide');
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'No remain tickets',
                showConfirmButton: false,
                timer: 1500,
            });
        }
    }
};

const initModalLayout = () => {
    $('.modal').on('show.bs.modal', function (event) {
        var idx = $('.modal:visible').length;
        $(this).css('z-index', 1040 + 10 * idx);
    });
    $('.modal').on('shown.bs.modal', function (event) {
        var idx = $('.modal:visible').length - 1; // raise backdrop after animation.
        $('.modal-backdrop')
            .not('.stacked')
            .css('z-index', 1039 + 10 * idx);
        $('.modal-backdrop').not('.stacked').addClass('stacked');
    });
};

const removeFocus = () => {};

const logout = async (event) => {
    event.preventDefault();
    await $.ajax({
        url: `/users/logout`,
    });
    window.location.replace('/entry');
};

const bindEvent = () => {
    $('#latestBtn').click(filterByLatest);
    $('#resetBtn').click(filterByReset);
    $('#hottestBtn').click(filterByHottest);
    $('#search').submit((event) => {
        event.preventDefault();
        filterBySearch($('#searchInput').val());
    });
    $('#logoutBtn').click(logout);
};

const store = {};
const userInfo = JSON.parse(Cookies.get('user'));
console.log(userInfo);

const main = async () => {
    await fetchPlaces(store);
    renderPlaces(store['places']);
    renderUser();
    bindEvent();
    initModalLayout();
};

main();
