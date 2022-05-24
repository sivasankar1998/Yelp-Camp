const express= require('express');
const mongoose = require('mongoose');
const path = require('path')
const methodOverride = require('method-override');
const app = express();
const campGroundSchema = require('./modules/campGround')
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(console.log('db connected'))
.catch(err=>console.log(err));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get("/",(req,res)=>{
    res.send("hello")
})

app.listen(3000,()=>{
    console.log("listening at port 3000");
})
