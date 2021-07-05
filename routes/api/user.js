const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const key = require('../../config/keys').secret
const User = require('../../models/User')
const multer = require('multer')
const upload = multer(

    )
    //api/user/register
    //Register new user
let newUser = {}
router.post('/register', upload.none(), (req, res) => {
        let {
            name,
            ic,
            email,
            department,
            position,
            password,
            confirm_password
        } = req.body

        if (password != confirm_password) {
            return res.status(400).json({
                msg: "Password do not match."
            })
        }
        //Check for unique email
        User.findOne({
                email: email
            }).then(user => {
                if (user) {
                    return res.status(400).json({
                        msg: "This email is already registered."
                    })
                } else {
                    //Register User
                    newUser = new User({
                        name,
                        ic,
                        email,
                        department,
                        position,
                        password
                    })
                }
                //Hashing password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save().then(user => {
                            return res.status(201).json({
                                success: true,
                                msg: "User is now registered"
                            })
                        }).catch((err) => {
                            console.log(err)

                        })
                    })
                })
            }) //end check
    })
    //api/user/login
    //Log in for existing user
router.post('/login', (req, res) => {
        User.findOne({
            email: req.body.email
        }).then(user => {
            if (!user) {
                return res.status(404).json({
                    msg: "Email is not found.",
                    success: false
                })
            }
            bcrypt.compare(req.body.password, user.password).then(isMatch => {
                if (isMatch) {
                    //Send JSON Token
                    const payload = {
                        _id: user._id,
                        name: user.name,
                        ic: user.ic,
                        email: user.email,
                        department: user.department,
                        position: user.position
                    }
                    jwt.sign(payload, key, {
                        expiresIn: 604800
                    }, (err, token) => {
                        res.status(200).json({
                            success: true,
                            token: `Bearer ${token}`,
                            user: user,
                            msg: "Logged in!"
                        })
                    })
                } else {
                    return res.status(404).json({
                        msg: "Password Incorrect",
                        succes: false
                    })
                }
            })
        })
    })
    //api/user/profile
    //Return User Profile after login
router.get('/profile', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    return res.json({
        user: req.user
    })

})
router.get('/', (req, res) => {
    User.find().then(user => {
        if (user) {
            return res.status(200).json(user)
        }
    }).catch((err) => {
        return res.status(400).json({
            msg: "error"
        })
    });
})

module.exports = router;