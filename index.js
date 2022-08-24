const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const todoHandler = require('./routeHandler/todoHandler');

// express app initialization
const app = express();
dotenv.config();
app.use(express.json())

const dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.0idnwn5.mongodb.net/${process.env.DB_DATABASE_NAME}?retryWrites=true&w=majority`;

// database connect with mongoose
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {console.log("Connection successful.")})
    .catch((err) => {console.log(err)})

app.use('/todo', todoHandler);


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