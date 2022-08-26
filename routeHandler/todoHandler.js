const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const todoSchema = require('../schemas/todoSchema');
const userSchema = require('../schemas/userSchema');
const checkLogin = require('../middlewares/checkLogin');

const Todo = new mongoose.model("Todo", todoSchema);
const User = new mongoose.model("User", userSchema);

// get active status todo sync or async way
router.get('/active', async (req, res) => {
    const todo = new Todo();
    try{
        const data = await todo.findActive();
        res.status(200).send({data});
    } catch(err){
        res.status(500).send({error: "There was a server side error! " + err});
    }
})

// get active status todo callback way
router.get('/active-callback', (req, res) => {
    const todo = new Todo();
    todo.findActiveCallback((err, data) => {
        if(err){
            res.status(500).send({error: "There was a server side error! " + err});
        } else {
            res.status(200).send({data});
        }
    });
})

// get title in js todo callback way
router.get('/language', async (req, res) => {
    try{
        const data = await Todo.find().byLanguage('javascript');
        res.status(200).send({data});
    } catch(err){
        res.status(500).send({error: "There was a server side error! " + err});
    }
})

// get language in title todo callback way
router.get('/title-js', (req, res) => {
    Todo.findTitleINJs((err, data) => {
        if(err){
            res.status(500).send({error: "There was a server side error! " + err});
        } else {
            res.status(200).send({data});
        }
    });
})

// get All todos
router.get('/', checkLogin, (req, res) => {
    Todo.find({}).populate('user', 'name username -_id').select({
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
router.post('/', checkLogin, async(req, res) => {
    const newTodo = Todo({
        ...req.body,
        user: req.userId
    });
    try{
        const todo = await newTodo.save();
        await User.updateOne({_id: req.userId}, {
            $push: {
                todos: todo._id
            }
        });
        res.status(200).json({message: "Todo was inserted successfully."});
    } catch(err){
        res.status(500).json({error: "There was a server side error!" + err});
    }
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