// server creation using express 
const express =require('express')
const app=express()
const cors =require('cors')
// console.log(express) //it will show the functions of the the express 
const port=3001

// requiring the router of web 
const web =require('./routes/web')

const cookieParser = require('cookie-parser');

// Middleware to parse JSON and cookies
app.use(cookieParser());
// DB connection 
const connectDB= require('./DB/connectDB')
const fileUpload = require('express-fileupload')
connectDB()
app.use(express.json())

//Image upload
app.use(fileUpload({
    useTempFiles:true,
    // tempFileDir:'/tmp/'
}));

//route the urls from frontend
app.use(
    cors({
        origin:"http://localhost:5173",//your frontend domain
        credentials: true,//allow creadentials (cookie)
    })
)




//to route the all requests of the path to web 
app.use('/api',web)
app.listen(port, console.log('server started at the localhost:3001')) //listening statr at port 