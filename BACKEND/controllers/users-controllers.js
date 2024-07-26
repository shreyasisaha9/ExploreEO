const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');
const { validationResult} = require('express-validator');
const User = require('../models/user');



const getUsers = async (req, res, next) => {
    // res.json({ users: DUMMY_USERS});
    let users;
    try{
      users = await User.find({}, '-password');
    }catch(err){
        const error = new HttpError(
        'Fetching users failed, please try again later.',
        500
        );
        return next(error);
    }
    res.json({users: users.map(user => user.toObject({ getters: true }))});
};


const signup = async (req, res, next) => {  
    const errors =  validationResult(req);
    if(!errors.isEmpty()){
         return next (new HttpError('Invalid inputs passed, please check your data', 422));
    }

    const { name, email, password } =req.body;

    // const hadUser = DUMMY_USERS.find(u=> u.email === email);

    // if(hadUser){
    //     throw new HttpError('Could not create user, email already exist', 401);
   
    // }
    let existingUser;
    try{
        existingUser = await User.findOne({ email: email })
    }catch(err){
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        return next(error);
    }

  if(existingUser){
        const error = new HttpError(
            'User exists already, please login instead.',
            422
        );
        return next (error);
    }
    // const createdUser ={
    //     id: uuidv4(),
    //     name,
    //     email,
    //     password
    // };

    const createdUser = new User({
        name, 
        email,
        password,
        image: 'https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg',
        places: []

    });
    try{
        await createdUser.save();
       }catch(err){
        const error = new HttpError(
            'Signing up failed, please try again.',
            500
        );
        return next(error);
       }


    

    // DUMMY_USERS.push(createdUser);

    res.status(201).json({user: createdUser.toObject({ getters: true })});

};


const login = async (req, res, next) => {
    const { email, password } =req.body;

    // const identifiedUser = DUMMY_USERS.find(u => u.email === email);
    // if(!identifiedUser || identifiedUser.password !==  password){
    //     throw new HttpError('Could not identify user, credentials seem to be wrong.', 422);
    // }

    let  existingUser;
    try{
        existingUser = await User.findOne({ email: email })
    }catch(err){
        const error = new HttpError(
            'Logging in failed, please try again later.',
            500
        );
        return next(error);
    }
    if(!existingUser || existingUser.password !== password){
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            401
        );
        return next(error);
    }


    res.json({message: 'Logged in.'});



};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
