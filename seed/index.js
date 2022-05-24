const mongoose = require('mongoose');
const campGround = require('../modules/campGround')
const cities = require('./cities');
const seed = require('./seedHelpers');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(console.log('db connected'))
.catch(err=>console.log(err));

const dbwrite = async ()=>{
    await campGround.deleteMany({});
    for(i=0;i<50;i++){
        let num=(len)=>(Math.floor(Math.random()*len));
        let title=seed.descriptors[num(seed.descriptors.length)]+" "+seed.places[num(seed.places.length)];
        let location=cities[num(cities.length)];
        let camp = new campGround({
            title:`${title}`,
            location:`${location.city},${location.state}`
        });
        await camp.save();
    }
}
dbwrite()
.then(()=>{
    mongoose.connection.close();
});