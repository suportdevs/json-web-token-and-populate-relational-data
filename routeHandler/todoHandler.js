const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const todoSchema = require('../schemas/todoSchema');

const Todo = new mongoose.model("Todo", todoSchema);


// get All todos
router.get('/', async (req, res) => {

});

// get a single todo
router.get('/:id', async (req, res) => {

});

// post a todo
router.post('/', async (req, res) => {
    const newTodo = Todo(req.body);
    await newTodo.save((err) => {
        if(err){
            res.status(500).json({error: "There was a server side error!" + err});
        } else {
            res.status(200).json({message: "Todo was inserted successfully."});
        }
    })
});

// post multiple todo
router.post('/all', async (req, res) => {

});

// update a todo
router.put('/:id', async (req, res) => {

});

// delete a todo
router.delete('/:id', async (req, res) => {

});

module.exports = router;