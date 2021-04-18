require('dotenv').config()
const express = require('express')
const app = express()
const ejs=require('ejs')
const path=require('path')
const expressLayout=require('express-ejs-layouts')
const mongoose = require('mongoose')
const session=require('express-session')
const flash = require('express-flash')


const PORT = process.env.PORT || 3000

//Database connection
const url='mongodb://localhost/pizza';
mongoose.connect(url,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:true})
const connection= mongoose.connection;
connection.once('open',()=>{
    console.log('Database connected..')
}).catch(err=>{
    console.log('Db connection failed...')
})
//Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{maxAge:1000*60*60*24} //24 hours
}))
app.use(flash())

//Assets
app.use(express.static('public'))



//set Template engine
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

// Route
require('./routes/web')(app)


app.listen(PORT,()=>(console.log(`App is listening on port ${PORT}`)))