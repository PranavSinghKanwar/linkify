const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

//authenticating using passport
passport.use(new LocalStrategy({
    usernameField: 'email'
    },
    async function(email, password, done){
        //finding a user and establishing identity
        try{
            let user = await User.findOne({email: email});

            if(!user || user.password != password){
                console.log('Invalid Username/Password');
                return done(null, false);
            }
            return done(null, user);
        }
        catch(err){
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

module.exports = passport;