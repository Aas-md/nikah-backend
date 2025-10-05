const express = require('express')
const mongoose = require('mongoose')
const listings = require('./routes/listingRoute.js')
const Listing = require('./models/listingModel.js')
const reviews = require('./routes/reviewRoute.js')
const userRoute = require('./routes/userRoute.js')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/userModel.js')
const path = require("path")
const session = require('express-session')
const MongoStore = require('connect-mongo')
const cors = require('cors');
const dbUrl = process.env.DB_URL

const mongo_url = process.env.DB_URL

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors()); 

main().then(() => {
    console.log("connected to db")
}).catch((e) => {
    console.log(e)
})

async function main() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
     mongoose.connect(mongo_url)
}

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600,
})

store.on("error",()=>{
    console.log("Error in mongo session store",err)
})

//sessions options

const sessionOptions = {
    store : store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge :  7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
}

app.use(session(sessionOptions))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.currUser = req.user
    next();
})

app.get('/', (req, res) => {
    res.send('Hello from Express and MongoDB!')
})

app.use('/listings',listings)
app.use('/listings/:id/reviews',reviews)
app.use('/',userRoute)


app.listen(3000, () => {
    console.log("Server is listing on port 3000")
})

// Catch-all 404 handler
app.all("{*any}", (req, res, next) => {
   res.send("page not found")
})

// Error-handling middleware (must be last)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Something went wrong"

    // Extract location from stack trace
    const stackLines = err.stack?.split('\n')
    const locationLine = stackLines && stackLines[1] ? stackLines[1].trim() : "Location not found"

    // Log error on server console (good for debugging)
    console.error(`[ERROR] ${message} -> ${locationLine}`)
   

    // Send JSON response to frontend
    res.status(statusCode).json({
        success: false,
        msg: message.message ? message.message : message,
        statusCode,
    })
})
