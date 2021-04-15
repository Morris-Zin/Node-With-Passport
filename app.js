const express = require('express'); 
const mongoose = require('mongoose')
const app = express(); 
const engine = require('ejs-mate');
const path = require("path");
const flash = require('connect-flash'); 
const session = require('express-session')
const passport = require('passport')

const PORT  = process.env.PORT || 3000;

//Setting mongoose 
const db = require('./config/keys').MongoURI; 
mongoose.connect(db, {useNewUrlParser : true, useUnifiedTopology: true})
.then(() => console.log("Successfully connected to the mongodb"))
.catch(err => console.log(err))

//setting up ejs 
app.engine('ejs', engine);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views'));

//Setting up static folder (public); 
app.use(express.static(path.join(__dirname , '/public')));

app.use(express.urlencoded({extended:false})); 

//Setting up session and flash message
app.use(session({
    secret: 'this should better be a secret 51878945&#&*&)@*(&!_(_)(#($&!+_(*(&!()',
    resave: true,
    saveUninitialized: true,
  }))

//Set up passport 
app.use(passport.initialize());
app.use(passport.session());
//Passport config
require('./config/passport')(passport)

app.use(flash()); 

app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg'); 
    res.locals.error_msg = req.flash('error_msg'); 
    res.locals.error = req.flash('error'); 
    next (); 
})

app.use('/', require('./routes/index')); 
app.use('/users', require('./routes/user'));


app.listen(PORT, () => { 
    console.log(`Server started on port ${PORT}`) 
})