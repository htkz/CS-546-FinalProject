$('#form-signup').submit(async (event) =>{
    event.preventDefault();
    const signupEmail = $('#signupEmail').val();
    const userName = $('#userName').val();
    const signupPassword = $('#signupPassword').val();
    const reEnterPassword = $('#reEnterPassword').val();

    const eCheck = signupEmailChecking(signupEmail);
    const nCheck = userNameChecking(userName);
    const pCheck = passwordChecking(signupPassword,reEnterPassword);

    if( !eCheck || !nCheck || !pCheck ) return;

    try{
        await $.ajax({
            url : 'http://localhost:3000/users/account/register',
            type : 'POST',
            data: {
                userName: userName,
                email: signupEmail,
                hashedPassword: signupPassword
            }
        });
    }catch(error){
        alert(error['responseJSON']['message']);
    }
});

function signupEmailChecking(signupEmail){
    let temp = document.getElementById('emailRule');

    if(temp.className === 'formatRules') temp.className='hidden';

    if(!signupEmail) {
        temp.className='formatRules';
        return false;
    }
    return true;
}

function userNameChecking(userName){
    let temp = document.getElementById('usernameRule');

    if(temp.className === 'formatRules') temp.className='hidden';

    if( !userName   ||
        userName.length<3   ||
        userName.length>16  ||
        !formatChecking(userName)
    ){
        temp.className='formatRules';
        return false;
    }

    return true;
}

function passwordChecking(signupPassword,reEnterPassword){
    let password = document.getElementById('passwordRule');
    let re_password = document.getElementById('re-passwordRule');

    if(password.className === 'formatRules') password.className='hidden';

    if(re_password.className === 'formatRules') re_password.className='hidden';

    if( !signupPassword ||
        !reEnterPassword ||
        signupPassword.length<8   ||
        signupPassword.length>16  ||
        !formatChecking(signupPassword)
    ){
        password.className='formatRules';
        return false;
    }

    if(signupPassword !== reEnterPassword){
        re_password.className='formatRules';
        return false;
    }

    return true;
}

function formatChecking(s){
    for(let c of s){
        if( !(c.charCodeAt(0)-'a'.charCodeAt(0)>=0 && c.charCodeAt(0)-'z'.charCodeAt(0)<=0)  &&
            !(c.charCodeAt(0)-'A'.charCodeAt(0)>=0 && c.charCodeAt(0)-'Z'.charCodeAt(0)<=0)  &&
            !(c.charCodeAt(0)-'0'.charCodeAt(0)>=0 && c.charCodeAt(0)-'9'.charCodeAt(0)<=0) 
        )   return false;
    }
    return true;
}