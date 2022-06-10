if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
};

const mongoose = require('mongoose');
const campGround = require('../models/campGround');
const reviews = require('../models/reviews');
const cities = require('./cities');
const seed = require('./seedHelpers');

mongoose.connect(process.env.db_url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    sslValidate: true,
    authMechanism: 'MONGODB-X509',
    sslCert: `/home/siva/web_dev/YelpCamp/X509-cert-3888626372674993216.pem`,
    sslKey: `/home/siva/web_dev/YelpCamp/X509-cert-3888626372674993216.pem`
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
            submittedBy:'62a35b92987877e2c8d31cdb',
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