const express = require("express");
const app = express();
const port = 8000;

app.use('/', require('./routes/index'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.listen(port, (err) => {
    if(err){
        console.log('error in running server: {err}');
    }
    console.log('Sever is running on port: {port}');
})