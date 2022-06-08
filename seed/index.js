const mongoose = require('mongoose');
const campGround = require('../models/campGround');
const reviews = require('../models/reviews');
const cities = require('./cities');
const seed = require('./seedHelpers');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(console.log('db connected'))
.catch(err=>console.log(err));

const dbwrite = async ()=>{
    await reviews.deleteMany({});
    await campGround.deleteMany({});
    for(i=0;i<20;i++){
        let num=(len)=>(Math.floor(Math.random()*len));
        let title=seed.descriptors[num(seed.descriptors.length)]+" "+seed.places[num(seed.places.length)];
        let location=cities[num(cities.length)];
        let camp = new campGround({
            submittedBy:'629dc0083a5002d727aab5a3',
            title:`${title}`,
            location:`${location.city},${location.state}`,
            image:[{path:'http://source.unsplash.com/collection/483251'}],
            price:`${num(30)}`,
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates, sequi et exercitationem quas incidunt in dicta nostrum libero pariatur sint. Dignissimos, odit? Explicabo laudantium libero nisi deleniti facilis adipisci eaque.'
        });
        await camp.save();
    }
}
dbwrite()
.then(()=>{
    mongoose.connection.close();
});