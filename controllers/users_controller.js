const User = require('../models/user');


//rendering the profile page
module.exports.profile = function(req, res){
    return res.render('user_profile', {
        title:"Profile"
    });
}

//rendering the sign up page
module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: "Sign Up to Linkify"
    })
}

//rendering the sign in page
module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Sign In to Linkify"
    })
}

// getting and storing the sign up data
module.exports.create = async function(req, res){
    try{
        if(req.body.password != req.body.confirm_password){
            return res.redirect('back');
        }
        let user = await User.findOne({email:req.body.email});
        if(!user){
            user = await User.create(req.body);
        }
        else{
            res.redirect('back');
        }
        return res.redirect('/users/sign-in');
    }
    catch(err){
        console.log('error in signing up', err);
    }
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    return res.redirect('/');
}


module.exports.destroySession = function(req, res){
    req.logout((err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Something went wrong");
        }
        res.redirect("/");
    });
}