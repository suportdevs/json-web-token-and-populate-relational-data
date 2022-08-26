const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const userSchema = require('../schemas/userSchema');
const router = express.Router();

const User = new mongoose.model('User', userSchema);

// singup mechanizam
router.post('/', async (req, res) => {
    try{
        const hasdPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await new User({
            name: req.body.name,
            username: req.body.username,
            password: hasdPassword,
            status: req.body.status
        })
        newUser.save();
        res.status(200).json({'message': 'Singup successfull.'});
    } catch(err){
        res.status(401).json({'error': 'Singup failed!' + err});
    }
});

// login mechanizam
router.post('/login', async(req, res) => {
    try{
        const user = await User.find({username: req.body.username});
        if(user && user.length > 0){

        } else {
            res.status(401).json({'error': 'Authentication failed!'});
        }
    } catch(err) {

    }
})


module.exports = router;