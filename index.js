const express = require("express");
const app = express();
const port = 8000;

const x = 10;

app.listen(port, (err) => {
    if(err){
        console.log('error in running server:  ${err}');
    }
    console.log('Sever is running on port: ${port}');
})