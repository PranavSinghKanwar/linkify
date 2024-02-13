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
const passportJWT = require("./config/passport-jwt-strategy");
const env = require('./config/environment');
const logger = require("morgan");

const chatServer = require('http').createServer(app);
const io = require("socket.io")(chatServer, {
    cors: {
      origin: "http://localhost:8080",
      methods: ["GET", "POST"]
    }
  });
  
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');
const path = require('path');

//if(env.name == 'development'){
app.use(sassMiddleware({
    src: path.join(__dirname, env.asset_path, '/scss'),
    dest: path.join(__dirname, env.asset_path, '/css'),
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}))
//}
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static(env.asset_path));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode,env.morgan.options));

app.use(expressLayouts);
//app.use('/', require('./routes/index'));


app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
//setup views
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name:'linkify',
    secret: env.session_cookie_key,
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