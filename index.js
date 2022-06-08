if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
};
 
const express= require('express');
const mongoose = require('mongoose');
const path = require('path')
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const expressError = require('./errorhandling/ExpressError');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/users');

const campRoute = require('./routes/campgrounds');
const reviewRoute = require('./routes/reviews');
const authRoute = require('./routes/userAuth');

const app = express();

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(console.log('db connected'))
.catch(err=>console.log(err));

app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

const sessionConfig = {
    secret:'secretcookie',
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + (1000*60*60*24*7),
        maxAge: (1000*60*60*24*7),
        httpOnly: true
    }
};
app.use(session(sessionConfig));
app.use(flash());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize())
app.use(passport.session())

app.use((req,res,next)=> {
    if (!req.isAuthenticated() && req.originalUrl !== '/login' && req.originalUrl !== '/campgrounds') {
        req.session.returnTo = req.originalUrl;
    };
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/campgrounds',campRoute);
app.use('/campgrounds/:id/reviews',reviewRoute);
app.use('/',authRoute);

app.get('/',(req,res)=>{
    res.send("hello");
});

app.all('*',(req,res,next)=>{
    next(new expressError("404 Page not Found",404));
});

app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong"} = err;
    res.status(status);
    res.render('error',{err,message});
});

app.listen(3000,()=>{
    console.log("listening at port 3000");
});
