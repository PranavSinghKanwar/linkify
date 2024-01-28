const express = require("express");
const app = express();
const port = 8000;
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const db = require('./config/mongoose');
const session = require("express-session");
const passport = require('./config/passport-local-strategy');
const passportLocal = require("passport-local");
const MongoStore = require('connect-mongo');

app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('./assets'));
app.use(expressLayouts);
//app.use('/', require('./routes/index'));


app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
//setup views
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name:'linkify',
    secret: 'impranav',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge: (1000*60*100)
    },
    store: MongoStore.create({
        clientPromise: db(),
        autoRemove: 'disabled'
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use('/', require('./routes/index'));

app.listen(port, (err) => {
    if(err){
        console.log('error in running server: {err}');
    }
    console.log('Sever is running on port: {port}');
})