const express= require('express');
const mongoose = require('mongoose');
const path = require('path')
const methodOverride = require('method-override');
const app = express();
const campGround = require('./modules/campGround');
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
});

app.get('/campgrounds',async (req,res)=>{
    let campgrounds = await campGround.find({});
    res.render('list', {campgrounds});
});

app.get('/campgrounds/new',(req,res)=>{
    res.render('new');
});

app.get('/campgrounds/:id/edit',async (req,res)=>{
    let campground = await campGround.findById(req.params.id);
    res.render('edit',{campground});
})

app.get('/campgrounds/:id',async (req,res)=>{
    let campground = await campGround.findById(req.params.id);
    res.render('show',{campground});
});

app.post('/campgrounds', async (req,res)=>{
    let camp = new campGround(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
});

app.put('/campgrounds/:id',async (req,res)=>{
    let {id} = req.params;
    await campGround.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${id}`);
})

app.delete('/campgrounds/:id',async (req,res)=>{
    let {id} = req.params;
    await campGround.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})
app.listen(3000,()=>{
    console.log("listening at port 3000");
});
