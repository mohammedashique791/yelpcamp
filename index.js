if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const campRoutes = require('./routes/campgrounds.js');
const AppError = require('./AppError');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const reviewRoute = require('./routes/review.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const helmet = require('helmet');
const userRoute = require('./routes/user');
const {storeReturnTo} = require('./storeprogress.js');
const databaseUrl = process.env.DB_URL;
const secret = process.env.SECRET || 'fonzziistheking791222';
const port = process.env.PORT || 3000;
mongoose.connect(databaseUrl)
.then(()=>{
    console.log("Mongo Database Connected");
})
.catch(err=>{
    console.log("Oh no Mongo Error");
})
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


const store = MongoStore.create({
    mongoUrl: databaseUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: secret
    }
});

const sessionConfig = {
    store,
    name: 'session',
    secret: secret,
    resave: false, 
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet({contentSecurityPolicy: false}));  
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next)=>{
    res.locals.fonzzi = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})



app.use('/campgrounds', campRoutes);
app.use('/campground', reviewRoute);
app.use('/', userRoute);



app.all('*', (req, res, next)=>{
    next(new AppError('Invalid Page', 404))
});


app.use((err, req, res, next)=>{
    const {statusCode = 500} = err;
    if(!err.message){
        err.message = 'Something Went Wrong'
    }
    req.flash('error', err.message);
    return res.redirect('/campgrounds');
})
app.listen(port, ()=>{
    console.log(`Serving on PORT ${port}`);
})