const userInfo = JSON.parse(Cookies.get('user'));
const userId = userInfo['_id'];
const id = '5ee28b31667e35ac0e8cbc31';

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

    $('#renderBio').text(userData.bio);
    if (userData.avatar)
        $('#userAvatar').attr(
            'src',
            `../../public/pic/avatar/${userData.avatar}`
        );
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
