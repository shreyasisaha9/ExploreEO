// const uuid = require('uuid/v4');
const { v4: uuidv4 } = require('uuid');

const { validationResult} = require('express-validator');
const HttpError = require('../models/http-error');
const mongoose = require('mongoose');


const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');
const { Session } = require('inspector');
// const places = require('../models/place');

// let DUMMY_PLACES =[
//     {
//         id: 'p1',
//         title: 'Empire State Building',
//         description: 'One of the most famous sky scrappers in the world!',
//         location: {
//             lat: 40.7484474,
//             lng: -73.9871516
//         }, 
//         address: '20 W 34th St, New York, NY 10001',
//         creator: 'u1'
//     }
// ];



const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;
    // const place = DUMMY_PLACES.find(p => {
    //     return p.id == placeId;
    // });

    let place;
    try{
     place =await Place.findById(placeId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not find a place.', 500
        );
        return next(error);
    }
    

    if(!place){
        // return res.status(404).json({message: 'Could not find a place for the provided id,'})
        const error = (new HttpError('Could not find a place for the provided id', 404));
        return next(error);
    }
    res.json({place: place.toObject( { getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    // const places = DUMMY_PLACES.filter( p => {
    //     return p.creator === userId;
    // });
    //const places = Place.find({ creator: userId})
    let userWithPlaces;
    try{
        userWithPlaces = await User.findById(userId).populate('places');
    }catch(err){
        const error = new HttpError(
            'Fetching places failed, please try again later.',
            500
        );
        return next(error);
    }

    if(!userWithPlaces || userWithPlaces.places.length === 0){        
        return next(
             new HttpError('Could not find places for the provided user id', 404)

             )};
    res.json({places: userWithPlaces.places.map(place => place.toObject( {getters: true})) });
 };

// let places;
//   try {
//     places = await Place.find({ creator: userId });
//   } catch (err) {
//     const error = new HttpError(
//       'Fetching places failed, please try again later',
//       500
//     );
//     return next(error);
//   }

//   if (!places || places.length === 0) {
//     return next(
//       new HttpError('Could not find places for the provided user id.', 404)
//     );
//   }

//   res.json({ places: places.map(place => place.toObject({ getters: true })) });
// };



 const createPlace = async (req, res, next) =>{

    const errors =  validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return next (new HttpError('Invalid inputs passed, please check your data', 422));
    }

    

    const {title, description, address, creator} = req.body;
    //const title = req.body.title
     let coordinates;
     try{
     coordinates = await getCoordsForAddress(address);}
     catch(error){
       return next(error);
     }


     const createdPlace = new Place({
      title,
      description,
      address,
      location: coordinates,
      image: 'https://s3.amazonaws.com/images.seroundtable.com/google-links-1510059186.jpg',
      creator
     });
    //{
    // id : uuidv4(),
    // title,
    // description,
    // location: coordinates,
    // address,
    // creator,
    // };
   //DUMMY_PLACES.push(createdPlace);
   let user;
   try{
    user = await User.findById(creator);

   }catch(err){
    const error = new HttpError(
        'Creating place failed, please try again.',
        500
    );
    return next(error);
   }

if(!user){
    const error = new HttpError('Could not find the user for the provided id', 404);
    return next (error);
   }
console.log(user);

// try {
//     await createdPlace.save();
//   } catch (err) {
//     const error = new HttpError(
//       'Creating place failed, please try again.',
//       500
//     );
//     return next(error);
//   }

//   res.status(201).json({ place: createdPlace });

 
   try{
    // await createdPlace.save();
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
   }catch(err){
    const error = new HttpError(
        'Creating place failed, please try again.',
        500
    
    );
    return next(error);
   }    
    res.status(201).json({place: createdPlace});
 };





const updatePlace  = async (req, res, next) => {
   
    const errors =  validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
       return next (new HttpError('Invalid inputs passed, please check your data', 422));
    }

    const {title, description} = req.body;
    const placeId = req.params.pid;


    // const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId)};
    // const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);

    let place;
    try{
        place = await Place.findById(placeId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not update place.', 500
        );
        return next(error);
    }

    place.title =title;
    place.description = description;

    // DUMMY_PLACES[placeIndex] = updatedPlace;
    // res.status(200).json({place: updatedPlace});

    try{
        await place.save();

    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not update place.', 500
        );
        return next(error);

    }
   res.status(200).json({ place: place.toObject({ getters: ture }) });
};


// const deletePlace  = async (req, res, next) => {
//     const placeId = req.params.pid;
//     // if(!DUMMY_PLACES.find(p => p.id === placeId)){
//     //     throw new HttpError('Could not find a place for that id.', 404);
//     // }
//     // DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId );
//     let place;
//     try{
//         place = await Place.findById(placeId).populate('creator');
//     }catch(err){

//         const error = new HttpError(
//             'Something went wrong, could not find the place.',
//             500
//         );
//         return next(error);
//     }

//     if(!place){
//         const error = new HttpError('Could no find place for this id.',
//         404
//        );
//     }
//     try{
//      const sess = await mongoose.startSession();
//      sess.startTransaction();
//      await place.remove();
//      places.creator.places.pull(place);
//      await place.creator.save({ session: sess});
//      await sess.commitTransaction();
     
      
//     }catch(err){

//         const error = new HttpError(
//             'Something went wrong, could not find the place.',
//             500
//         );
//         return next(error);
//     }
//     res.status(200).json({message: 'Place is deleted.'});
// };

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;
  
    let place;
    try {
      place = await Place.findById(placeId).populate('creator');
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not delete place.',
        500
      );
      return next(error);
    }
  
    if (!place) {
      const error = new HttpError('Could not find place for this id.', 404);
      return next(error);
    }
  
    try {
      // Use deleteOne or findByIdAndRemove instead of remove
    //   await Place.deleteOne({ _id: placeId });
    const sess = await mongoose.startSession();
         sess.startTransaction();
         await Place.deleteOne({ _id: placeId })
         place.creator.places.pull(place);
         await place.creator.save({ session: sess});
         await sess.commitTransaction();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not delete place.',
        500
      );
      return next(error);
    }
  
    res.status(200).json({ message: 'Deleted place.' });
  };

 exports.getPlaceById = getPlaceById;
 exports.getPlacesByUserId = getPlacesByUserId;
 exports.createPlace = createPlace;
 exports.updatePlace = updatePlace;
 exports.deletePlace = deletePlace;

 

