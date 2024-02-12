const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});

const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'impranav',
    db_name: 'linkify_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth:{
            user: 'kingbaroushouei1@gmail.com',
            pass: process.env.GMAIL_LINKIFY_MY_PASSWORD
        }
    },
    jwt_secret: 'linkify',
    morgan:{
        mode: 'dev',
        options: {
            stream: accessLogStream
        }
    }
}

const production = {
    name: 'production',
    asset_path: process.env.LINKIFY_ASSET_PATH,
    session_cookie_key: process.env.LINKIFY_SESSION_COOKIE_KEY,
    db_name: 'linkify_production',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth:{
            user: 'kingbaroushouei1@gmail.com',
            pass: process.env.GMAIL_LINKIFY_MY_PASSWORD
        }
    },
    jwt_secret: process.env.LINKIFY_JWT_SECRET,
    morgan:{
        mode: 'combined',
        options: {
            stream: accessLogStream
        }
    }
}

module.exports = eval(process.env.LINKIFY_ENVIRONMENT) == undefined ? development:eval(process.env.LINKIFY_ENVIRONMENT);