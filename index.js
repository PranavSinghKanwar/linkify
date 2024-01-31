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
const sassMiddleware = require("node-sass-middleware");
const flash = require("connect-flash");
const customMware = require("./config/middleware");

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}))
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
        maxAge: (1000*60*100),
        secure: false
    },
    store: MongoStore.create({
        clientPromise: db(),
        autoRemove: 'disabled'
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

app.use('/', require('./routes/index'));

app.listen(port, (err) => {
    if(err){
        console.log('error in running server: {err}');
    }
    console.log('Sever is running on port: {port}');
})