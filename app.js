/*
                   _ooOoo_
                  o8888888o
                  88" . "88
                  (| -_- |)
                  O\  =  /O
               ____/`---'\____
             .'  \\|     |//  `.
            /  \\|||  :  |||//  \
           /  _||||| -:- |||||-  \
           |   | \\\  -  /// |   |
           | \_|  ''\---/''  |   |
           \  .-\__  `-`  ___/-. /
         ___`. .'  /--.--\  `. . __
      ."" '<  `.___\_<|>_/___.'  >'"".
     | | :  `- \`.;`\ _ /`;.`/ - ` : | |
     \  \ `-.   \_ __\ /__ _/   .-` /  /
======`-.____`-.___\_____/___.-`____.-'======
                   `=---='
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Codes are far away from bugs with the Buddha protecting
*/

const express = require('express');
const app = express();
const configRoutes = require('./routes');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');

const static = express.static(__dirname + '/public');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
    let currentTime = new Date().toUTCString();
    let requestMethod = req.method;
    let requestRoute = req.originalUrl;
    console.log(`[${currentTime}]: ${requestMethod} ${requestRoute}`);
    next();
});

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(
    session({
        name: 'UserCookie',
        secret: 'I want to tell you!',
        resave: false,
        saveUninitialized: true,
    })
);

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
