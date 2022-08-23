const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const todoSchema = require('../schemas/todoSchema');

const Todo = new mongoose.model("Todo", todoSchema);


// get All todos
router.get('/', (req, res) => {
    Todo.find({status: 'active'}).select({
        _id: 0,
        date: 0,
        status:0
    }).limit(2).exec((err, data) => {
        if(err){
            res.status(500).json({error: "There ware a server side error!" + err});
        } else {
            res.status(200).json({result: data, message: "Success"});
        }
    });
});

// get a single todo
router.get('/:id', (req, res) => {
    Todo.find({_id: req.params.id}, (err, data) => {
        if(err){
            res.status(500).json({error: "There ware a server side error!" + err});
        } else {
            res.status(200).json({result: data, message: "Success"});
        }
    }).clone();
});

// post a todo
router.post('/', (req, res) => {
    const newTodo = Todo(req.body);
    newTodo.save((err) => {
        if(err){
            res.status(500).json({error: "There was a server side error!" + err});
        } else {
            res.status(200).json({message: "Todo was inserted successfully."});
        }
    })
});

// post multiple todo
router.post('/all', async (req, res) => {
    try{
        await Todo.insertMany(req.body);
        res.status(500).json({error: "There ware a server side error!" + err});
    } catch(err){
        res.status(200).json({message: "Todo ware inserted successfully."});
    }
});

// update a todo
router.put('/:id', (req, res) => {
    // update one todo
    // await Todo.updateOne(
    //     {_id: req.params.id},
    //     {
    //         $set: {
    //             "title": "active"
    //         },
    //     }, (err) => {
    //         if(err){
    //             res.status(500).json({error: "There was a server side error!" + err});
    //         } else {
    //             res.status(200).json({message: "Todo was updated successfully."});
    //         }
    //     }).clone();
    // console.log(req.params.id);
    const result = Todo.findByIdAndUpdate({_id: req.params.id}, {
        $set: {
            status: "active"
        }
    },
    { new: true, useFindAndModify: false},
     (err) => {
        if(err){
            res.status(500).json({error: "There was a server side error!" + err});
        } else {
            res.status(200).json({message: "Todo was updated successfully."});
        }
    }).clone();
    console.log(result);
});

// delete a todo
router.delete('/:id', async (req, res) => {
    try{
        await Todo.deleteOne({_id: req.params.id}).clone();
        res.status(200).json({message: "Todo was deleted Successfully!"});
    }
    catch(err) {
        res.status(500).json({error: "There ware a server side error!"});
    }
});

module.exports = router;