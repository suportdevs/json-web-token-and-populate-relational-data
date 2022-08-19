const express = require('express');
const mongoose = require('mongoose');

// express app initialization
const app = express();

const dbUrl = 'mongodb+srv://suportdevs:@$uportdev$123%@cluster0.0idnwn5.mongodb.net/todo?retryWrites=true&w=majority';
const dbUrls = 'mongodb+srv://suportdevs:suportdevs@cluster0.wanmr.mongodb.net/organicdb?retryWrites=true&w=majority';

// database connect with mongoose
mongoose.connect(dbUrls, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {console.log("Connection successful.")})
    .catch((err) => {console.log(err)})

app.get('/', (req, res) => {
    res.send("hello world.");
})

// default error handler
const errorHandler = (err, req, res, next) => {
    if(res.headersSent){
        next(err);
    } else {
        res.status(500).json({error: err});
    }
}

app.listen(3000, () => {
    console.log("Listening to port 3000");
})