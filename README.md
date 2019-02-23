# MERN-stack
Mongo-atlas, Express, React, Node.js, Rest api

Node-Rest-Service
Incrementing integers as a node-mongo-atlas-Rest-Service I have developed this service using node.js, mongodb atlas, jwt. General Usage Notes: Following are the routes that I have created:
signup: This is used to signup new user. Firstly it checks if user is does not exist with the given email id. If not, user is created in mongodb atlas with hashed password. And JWT is generated and displayed. This is a post request. Input: { "username": "Maria", "email": "Maria@gmail.com", "password": "1234" }
login: This is used to allow login for existing users. If user is valid JWT is generated and displayed. This is a post request. Input: { "email": "Maria@gmail.com", "password": "1234" }
current: This route is secured. If valid token is available in the header then it gets the current integer for the user. This is a get request.
next: This route is secured. If valid token is available in the header then it gets the next integer in the sequence for the user. This is a patch request.
reset: This route is secured. If valid token is available in the header then it resets an integer for the user. This is a patch request.
Input: { "cnt": 100 }
/:username: This is to delete existing user. This is a delete request. This is I have created to remove temporary user created during development process.

React
Added a UI that consumes above rest service. Developed user login functionality. 
When valid user logged in through a web page (used "Login" api) its current ineteger is displayed on the web page (using "current" api)
