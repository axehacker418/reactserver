// Router function calling to to use in routing the apis 
const express=require('express')
const UserController = require('../Controllers/UserController')
const TripController = require('../Controllers/TripController')
const checkAuth = require('../Middelwere/auth')
const router=express.Router()


// router.get('/', (req, res) => {
//     res.send('Web is working but Bro/Sis you are on the wrong URL'); // sends "Hello" to the browser
// });
router.post("/register",UserController.register)
router.post('/login',UserController.Login)
// Optional: profile route
router.get('/profile', UserController.profile);
// router.get('/register', (req, res) => {
//   res.send("Register route is working (use POST for actual registration).");
// });
// Logout
router.get('/logout', UserController.logout);


//Travel links 
router.post('/trip/:id',checkAuth, TripController.addtrip)
router.get('/gettrip',checkAuth,TripController.getTrip)



//now time to export the router function to use in app.js
module.exports=router
