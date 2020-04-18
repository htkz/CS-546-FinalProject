async function signUpClick(){
    const signupForm = document.getElementById('form-signup');
    const signupEmail = signupForm.signupEmail.value;
    const userName = signupForm.userName.value;
    const signupPassword = signupForm.signupPassword.value;
    const reEnterPassword = signupForm.reEnterPassword.value;

    let signupResult;
    try{
        signupResult = await $.ajax({
            url : 'http://localhost:3000/users/account/register',
            type : 'POST',
            data: {
                userName: userName,
                email: signupEmail,
                hashedPassword: signupPassword
            }
        });
    }catch(e){
        alert(e);
    }
}

function signupEmailChecking(signupEmail){

}

function userNameChecking(userName){

}

function passwordChecking(signupPassword,reEnterPassword){

}