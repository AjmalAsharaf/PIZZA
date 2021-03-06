require('dotenv').config()
const express = require('express')
const app = express()
const ejs=require('ejs')
const path=require('path')
const expressLayout=require('express-ejs-layouts')
const mongoose = require('mongoose')
const session=require('express-session')
const flash = require('express-flash')
const MongoDBStore = require('connect-mongodb-session')(session);
const passport =require('passport')
const Emitter= require('events')

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


//mongo session store
var store = new MongoDBStore({
    uri:'mongodb://localhost/pizza',
    collection: 'sessions'
})

//Event Emitter
const eventEmitter= new Emitter()
app.set('eventEmitter',eventEmitter)


//Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave:false,
    store:store,
    saveUninitialized:false,
    cookie:{maxAge:1000*60*60*24} //24 hours
}))

//Passport config
const passportInit=require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


app.use(flash())

//Assets
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//Global middleware
app.use((req,res,next)=>{
    res.locals.session=req.session
    res.locals.user=req.user
    next()
})

//set Template engine
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

// Route
require('./routes/web')(app)


const server = app.listen(PORT,()=>(console.log(`App is listening on port ${PORT}`)))

// Socket

const io = require('socket.io')(server)

io.on('connection',(socket)=>{
     //Join
     console.log(socket.id)
     socket.on('join',(orderId)=>{
         console.log(orderId)
        socket.join(orderId)
     })
})

eventEmitter.on('orderUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated',data)
})

eventEmitter.on('orderPlaced',(data)=>{
    io.to('adminRoom').emit('orderPlaced',data)

})