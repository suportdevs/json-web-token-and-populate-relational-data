const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
            const isValidPassword = await bcrypt.compare(req.body.password, user[0].password);
            if(isValidPassword){
                const token = await jwt.sign({
                    username: user[0].username,
                    userId: user[0]._id
                }, process.env.JWT_SECRET, {
                    expiresIn: '1h'
                });

                res.status(200).json({access_token: token, message: 'Authentication successfull.'})
            } else {
                res.status(401).json({'error': 'Authentication failed!'});
            }
        } else {
            res.status(401).json({'error': 'Authentication failed!'});
        }
    } catch(err) {
        res.status(401).json({'error': 'Authentication failed!' + err});
    }
})


module.exports = router;