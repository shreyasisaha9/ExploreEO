const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');


const app =  express();

app.use(bodyParser.json());  ///post req expect to have data in the body while get req dont have a req body

app.use('/api/places' ,placesRoutes);
app.use('/api/users', usersRoutes);


app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.',404 );
    throw error;
}); //only runs if we didnt send the response in one of our routes before

app.use((error, req, res, next )=> {

    if(res.headerSent){

        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occured!'});


});


mongoose
 .connect('mongodb+srv://shrey:shreyas35Q@cluster0.x2bmwv2.mongodb.net/mern?retryWrites=true&w=majority&appName=Cluster0')
 .then(() => {
    app.listen(5000);
   })
 .catch(err => {
    console.log(err);
 });


 