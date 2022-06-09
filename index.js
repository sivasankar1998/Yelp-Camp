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
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

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
    name:'session',
    secret:'secretcookie',
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + (1000*60*60*24*7),
        maxAge: (1000*60*60*24*7),
        httpOnly: true
        //secure:true
    }
};
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    //"https://api.tiles.mapbox.com/",
    //"https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    //"https://api.mapbox.com/",
    //"https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    /* "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/", */
];
const fontSrcUrls = [];

app.use(
    helmet({
        contentSecurityPolicy:{
            directives: {
                defaultSrc: [],
                connectSrc: ["'self'", ...connectSrcUrls],
                scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
                styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
                workerSrc: ["'self'", "blob:"],
                objectSrc: [],
                imgSrc: [
                    "'self'",
                    "blob:",
                    "data:",
                    "https://res.cloudinary.com/p4vz7rrj8fg33b/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                    "http://source.unsplash.com/",
                    "https://images.unsplash.com/",
                ],
                fontSrc: ["'self'", ...fontSrcUrls],
            }
        }
    }
));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize())
app.use(passport.session())

app.use(
    mongoSanitize({
      replaceWith: '_',
    }),
);

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
    res.render('home');
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
