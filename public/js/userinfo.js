const userInfo = JSON.parse(Cookies.get('user'));
const userId = userInfo['_id'];
const id = '5ee7d616bbe970deb49e0b49';

let counter = 0;

const changeFocus = (id) => {
    $('.navbar li').each((index, li) => {
        const $li = $(li);
        if ($li.attr('id') === id) {
            $li.attr('class', 'focus');
            $($li.attr('data-id')).fadeIn(1000);
            for (let i = 0; i < counter; i++) overflowCheck(i);
        } else {
            $li.attr('class', '');
            $($li.attr('data-id')).hide();
        }
    });
};

const dataPreload = async () => {
    changeFocus('personalInfoNav');

    const userData = await $.ajax({
        type: 'GET',
        url: `/users/otheruser/${id}`,
    });
    console.log(userData);

    //PersonalInfo Page
    $('#userName').text(userData.name);
    $('#renderUserName').text(userData.name);
    if (!userData.gender) {
        $('#userGender').text('Unknown');
        $('#renderGender').text('Unknown');
    } else {
        $('#userGender').text(userData.gender);
        $('#renderGender').text(userData.gender);
    }
    if (!userData.birthDate) {
        $('#userAge').text('???');
        $('#renderAge').text('???');
        $('#renderBirthday').text('Unknown');
    } else {
        $('#userAge').text(birthDatePreload(userData.birthDate) + ' Years Old');
        $('#renderAge').text(
            birthDatePreload(userData.birthDate) + ' Years Old'
        );
        $('#renderBirthday').text(userData.birthDate);
    }
    if (!userData.bio) $('#renderBio').text('None');
    else $('#renderBio').text(userData.bio);
    if (userData.avatar) {
        $('#userAvatar').attr(
            'src',
            `../../public/pic/avatar/${userData.avatar}`
        );
    }

    //userComments Page
    if (!userData.comments)
        $('#comments').append('<div class="">This user has no comment.<div>');
    else {
        for (let i of userData.comments) {
            $('#comments').append(`
            <div class="textBlock">
                <div class="textContent" id="${counter}">
                    ${i.content} 
                </div>
                <div class="btnDiv">
                    <Button type="button" class="btn btn-secondary btn-sm" onclick="btnClick(${counter})" id="btn${counter}">More</Button>
                </div>
                <div class="textTitle">
                This user has comment on ${i.placeName}
                </div>
            </div>`);
            counter++;
        }
    }

    //upvoteComments Page
    if (!userData.upvoteComments)
        $('#upvotes').append(
            '<div class="">This user has no upvoted comment.<div>'
        );
    else {
        for (let i of userData.upvoteComments) {
            $('#upvotes').append(`
            <div class="textBlock">
                <div class="textContent" id="${counter}">
                    ${i.content} 
                </div>
                <div class="btnDiv">
                    <Button type="button" class="btn btn-secondary btn-sm" onclick="btnClick(${counter})" id="btn${counter}">More</Button>
                </div>
                <div class="textTitle">
                This user has upvoted this comment on ${i.placeName}
                </div>
            </div>`);
            overflowCheck(counter);
            counter++;
        }
    }

    //Relation Page
    $('#relations').append('没写');
};

const btnClick = (counter) => {
    if ($(`#${counter}`).css('max-height') === '100px') {
        $(`#${counter}`).css('max-height', 'none');
        $(`#btn${counter}`).text('Fold');
    } else {
        $(`#${counter}`).css('max-height', '100px');
        $(`#btn${counter}`).text('More');
    }
};

const overflowCheck = (id) => {
    const content = document.getElementById(id);
    const offset = content.offsetHeight;
    const scroll = content.scrollHeight;
    if (offset == scroll) $(`#btn${id}`).addClass('hidden');
    else $(`#btn${id}`).removeClass('hidden');
};

const birthDatePreload = (birthDate) => {
    if (!birthDate) return '???';
    const yr = parseInt(birthDate.substring(0, 4));
    const mh = parseInt(birthDate.substring(5, 7)) - 1;
    const dy = parseInt(birthDate.substring(8, 10));
    const age = ageCaculator(new Date(yr, mh, dy));
    return age;
};

const ageCaculator = (birthDate) => {
    const diff = new Date().getTime() - birthDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
};

const init = async () => {
    dataPreload();
    $('.navbar li').each((index, li) => {
        const $li = $(li);
        $li.click(() => {
            changeFocus($li.attr('id'));
        });
    });
};

init();
