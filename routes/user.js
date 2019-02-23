const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 
const bcrypt = require('bcrypt');
const User = require('../models/user');
const app = express();
const router = express.Router();

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

//To signup new user. 
router.post('/signup', (req, res, next) => {
    //to check if email already exist
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length >= 1){
            return res.status(409).json({
                user,
                message: 'Auth failed'//email exists
            })
        }
        else{
            //email does not exits. Signup the user.
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err){
                    return res.status(500).json({
                        error: err
                    });
                }
                else
                {
                    //save a user in the mongodb atlas database
                    const user = new User({
                        username: req.body.username,
                        email: req.body.email,
                        password: hash, 
                        counter: 1
                        });
                    user
                        .save()
                        .then(result => {
                            //user is created then generate the token for this user
                            jwt.sign({user}, 'secretkey', (err, token) => {
                                res.status(201).json({
                                message: 'User created',
                                token		
                                });
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                }
            });
        }
    })
});

//To allow login for existing user.
router.post('/Login', (req, res, next) => {
    //to check if email already exist
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length < 1){
            return res.status(409).json({
                user,
                message: 'Auth1 failed'//no email exists
            })
        }
        else{
            //email does exits. check the password.
            console.log(user[0].password);
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                console.log(err);
                if (err){
                    return res.status(409).json({
                    user,
                    message: 'Auth2 failed'//password does not match
                })
             }
             if (result)
             {
                //User is valid. Generate the token for this user.
                jwt.sign({user: user[0]}, 'secretkey', (err, token) => { 
                    return res.send(token)
                    /*return res.status(200).json( {
                     message: 'Auth Successful',
                     token
                 })*/
                });
             }
             //res.status(401).json( {
             //   message: 'Auth3 failed'
            // });
            });
        }

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

//Reset an integer. First secure the route and then reset the integer for a user.
router.patch('/reset', verifyToken, (req, res, next) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
	        res.sendStatus(403).json(
            authData
            )
        } 
    else {
        const uname = (authData.user.username);
        const cnt = req.body.cnt;    
        User.update({username: uname}, { $set: {counter: cnt}})
                    .exec()
                    .then(docs => {
                    res.status(200).json({ 
                    message: 'Integer is reset'
                    });
            
                    });
                    } 
 });
})

//Get the next integer. First secure the route and then get the next integer for a user.
router.patch('/next', verifyToken, (req, res, next) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
	        res.sendStatus(403).json(
            authData
            )
        } 
    else {
        const uname = (authData.user.username);
        var inte=1;
        User.find({ username:  uname  } )
           .exec()
            .then (docs =>{
                docs.map(doc => {
                name= doc.username;
                inte=doc.counter;
                inte = inte +1;
                User.update({username: uname}, { $set: {counter: doc.counter + 1}})
                .exec()
                .then(result => {
                    res.status(200).json({ 
                        docs,
                        message: 'Integer is incremented.',
                        integer: inte
                        });
                    });
                }) 
            } );
    }
});
})

//get the current integer. First secure the route and then get the current integer for a user
router.get('/current', verifyToken, (req, res, next) => {
	
    var rups;
    jwt.verify(req.token, 'secretkey', (err, authData) => {
	if (err) {
	 res.sendStatus(403);
	} else {
        
        const uname = (authData.user.username);
        User.findOne({ username:  uname  } )
            .exec()
            .then (doc =>{
                res.status(200).json({
                    name: doc.username,
                    counter: doc.counter
                });
                
                           
            } );
            //return res.send(rups)
        /*User.find({ username:  uname  } )
            .exec()
            .then (docs =>{
               res.json({
                    a: docs.map(doc => {
                        //return res.send(doc.counter)
                        return{ 
                            name: doc.username,
                            Integer: doc.counter
                        }
                    }) 
                  });
            } );*/
    }
	});
});
//router to delete the user entry
router.delete('/:username', (req, res, next) => {
     User.remove({ username: req.params.username })
    .exec()
    .then( result => {
        res.status(200).json({
            message: 'User deleted'
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
});


//verify token
function verifyToken(req, res, next){
	//get auth header value
	const bearerHeader = req.headers['authorization'];
	//check if bearer is undefined
	if (typeof bearerHeader !== 'undefined'){
		//split at the space
		const bearer = bearerHeader.split(' ');
		//get token from array
		const bearerToken = bearer[1];
		//set the token
		req.token = bearerToken;
		//next middleware
		next(); 
	} else {
	//forbidden
	res.sendStatus(403);
	} 
	
}

module.exports = router;