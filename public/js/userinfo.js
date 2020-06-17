const userInfo = JSON.parse(Cookies.get('user'));
const userId = userInfo['_id'];
const id = '5ee7d616bbe970deb49e0b49';

const dataPreload = async () => {
    const userData = await $.ajax({
        type: 'GET',
        url: `/users/otheruser/${id}`,
    });
    console.log(userData);
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
    if (!userData.comments)
        $('#comments').append('<div class="">This user has no comment.<div>');
    else {
        let counter = 0;
        for (let i of userData.comments) {
            $('#comments').append(`
            <div class="textBlock">
                <div class="textContent" id="${counter}">
                    ${i.content} 
                </div>
                <Button type="button" class="btn btn-secondary btn-sm" onclick="btnClick(${counter})" id="btn${counter}">More</Button>
                <div class="textTitle">
                This user has comment on ${i.placeName}
                </div>
            </div>`);
            counter++;
        }
    }
};

const btnClick = (counter) => {
    if($(`#${counter}`).css('max-height') === '100px'){
        $(`#${counter}`).css('max-height', 'none');
        $(`#btn${counter}`).text('Fold');
    }else{
        $(`#${counter}`).css('max-height', '100px');
        $(`#btn${counter}`).text('More');
    }
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
};

init();
