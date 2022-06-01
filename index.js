const express= require('express');
const mongoose = require('mongoose');
const path = require('path')
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const asyncCatch = require('./errorhandling/asyncCatch');
const expressError = require('./errorhandling/ExpressError');
const morgan = require('morgan');
const campGround = require('./modules/campGround');
const Reviews = require('./modules/reviews');
const campRoute = require('./routes/campgrounds');
const reviewRoute = require('./routes/reviews');

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

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

app.use('/campgrounds',campRoute);
app.use('/campgrounds/:id/reviews',reviewRoute);


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
