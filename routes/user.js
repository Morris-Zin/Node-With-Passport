const express = require('express'); 
const router = express.Router(); 
const passport = require('passport')
const bcrypt = require('bcryptjs'); 
//USER MODEL  

const User = require('../models/User')

router.get('/register', (req,res) => { 
    res.render("register"); 
})

router.get('/login', (req,res) => { 
    res.render("login"); 
})

router.post('/register', async (req,res) => {
    const {name, email, password, password2} = req.body; 
    let errors = [];    
    if (!name || !email || !password || !password2)
    {
        errors.push({msg: 'Please fill out all fields'}); 
    }
    if (password !== password2)
    {
        errors.push({msg: 'Passwords should be matched'});
    }
    if (password.length < 6)
    {
        errors.push({msg: "Password should have at least 6 characters"})
    }
    if (errors.length > 0)
    {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
        
    } else {
    const user = await User.findOne({email: email})
    if(user)
    {
        errors.push({msg: "User already exist"})
        res.render('register', { 
            errors, 
            name, 
            email, 
            password,password2
        }); 
    }
    else {
        const newUser = new User({
            name,
            email,
            password
        });
        
        //hash password
         bcrypt.genSalt(10, (err,salt) => bcrypt.hash(newUser.password, salt, async (err,hash) => {
            if (err) throw err; 
            newUser.password = hash;
            await newUser.save(); 
            req.flash("success_msg", "You are succesfully signed up please login to continue"); 
            res.redirect('/users/login');
        }))
    }   
    }
});

router.post('/login',  passport.authenticate('local', {failureRedirect: '/users/login',failureFlash: true}), (req,res,next) => {
    req.flash("success_msg", "You are successfully logged in welcome 🔥🔥🔥")
    res.redirect('/dashboard'); 
})

router.get('/logout', (req,res) => {
    req.logout();
    req.flash("success_msg", "Succesfully logged out")
    res.redirect('/users/login')
})

module.exports = router; 