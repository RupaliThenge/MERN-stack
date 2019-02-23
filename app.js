const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');

const app = express();
const userRoutes = require('../nodeauthapi/routes/user');

mongoose.connect('mongodb://sa:admin@node-rest-counter-shard-00-00-b3njp.mongodb.net:27017,node-rest-counter-shard-00-01-b3njp.mongodb.net:27017,node-rest-counter-shard-00-02-b3njp.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-counter-shard-0&authSource=admin&retryWrites=true')


app.use("/user", userRoutes);


app.get('/api', (req, res) => {
	res.json({
	message: 'Welcome to the API'
	});

});

/*var cnt =0;
//route that need to secure 
app.post('/api/posts', verifyToken, (req, res) => {
	//var idd;
	jwt.verify(req.token, 'secretkey', (err, authData) => {
	if (err) {
	 res.sendStatus(403);
	} else {
	//cnt = cnt + 1;


	var temp = (authData.user.id);
	
	const userTemp = authData;
	res.json({
	message: 'Post Created...',
	authData,
	temp, 
	cnt
	});

	}
	
	});
	
});

//get the current integer
app.get('/api/current', verifyToken, (req, res) => {
	
	jwt.verify(req.token, 'secretkey', (err, authData) => {
	if (err) {
	 res.sendStatus(403);
	} else {
	var temp = (authData.user.id);
	res.json({
	message: 'current integer is:',
	cnt
	});
	}
	});
});


//reset the integer
app.put('/api/current', verifyToken, (req, res) => {
	
	jwt.verify(req.token, 'secretkey', (err, authData) => {
	if (err) {
	 res.sendStatus(403);
	} else {
	cnt = 0;
	res.json({
	message: 'current integer is:',
	cnt
	});

	}
	
	});
	
});




//login route
app.post('/api/login', (req, res) => {
	//mock user
	const user={
	id:1,
	username: 'rups',
	email: 'rups@gmail.com'
	}

	jwt.sign({user}, 'secretkey', (err, token) => {
		res.json ({
		token		
		});
	});
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
	
}*/


app.listen(5000, () => console.log('server started on port 5000'));