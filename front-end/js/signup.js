$('#form-signup').submit(async (event) =>{
    event.preventDefault();
    const signupEmail = $('#signupEmail').val();
    const userName = $('#userName').val();
    const signupPassword = $('#signupPassword').val();
    const reEnterPassword = $('#reEnterPassword').val();

    if(!signupEmailChecking(signupEmail)) return;
    if(!userNameChecking(userName)) return;
    if(!passwordChecking(signupPassword,reEnterPassword)) return;

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
    if(!signupEmail) {
        errorDisplay('No Email Input');
        return false;
    }
    return true;
}

function userNameChecking(userName){
    if(!userName){
        errorDisplay('No Username Input');
        return false;
    }

    if( userName.length<3   ||
        userName.length>16  ||
        !formatChecking(userName)
    ){
        errorDisplay('Illegal username');
        return false;
    }

    return true;
}

function passwordChecking(signupPassword,reEnterPassword){
    if(!signupPassword){
        errorDisplay('No Sign-up Password Input');
        return false;
    }

    if(!reEnterPassword){
        errorDisplay('No Re-enter Password Input');
        return false;
    }

    if( signupPassword.length<8   ||
        signupPassword.length>16  ||
        !formatChecking(signupPassword)
    ){
        errorDisplay('Illegal sign-up password');
        return false;
    }

    if(signupPassword !== reEnterPassword){
        errorDisplay('Re-enter password not match');
        return false;
    }

    return true;
}

function errorDisplay(error){
    alert(error);
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