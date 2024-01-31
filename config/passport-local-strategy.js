const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

//authenticating using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
    },
    async function(req, email, password, done){
        //finding a user and establishing identity
        try{
            let user = await User.findOne({email: email});

            if(!user || user.password != password){
                req.flash('error', 'Invalid Username/Password')
                console.log('Invalid Username/Password');
                return done(null, false);
            }
            else return done(null, user);
        }
        catch(err){
            req.flash('error', err);
            console.log('error in finding user --> Passport');
            done(err);
        }
    }    
));


passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(async function(id, done){
    try{
        let user = await User.findById(id);
        done(null, user);
    }
    catch(err){
        console.log('error in finding user --> Passport');
        done(err);
    }
});


passport.checkAuthentication = function(req, res, next){
    //if user is singed in then pass on to controllers action
    if(req.isAuthenticated()){
        return next();
    }
    //if user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
}


module.exports = passport;