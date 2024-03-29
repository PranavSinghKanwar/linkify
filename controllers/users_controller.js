const User = require('../models/user');
const fs = require('fs');
const path = require('path');

//rendering the profile page
module.exports.profile = async function(req, res){
    try{
        let current_user = await User.findById(req.params.id);
        return res.render('user_profile', {
            title:"Profile",
            profile_user: current_user
        });
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.update = async function(req, res){
    try{
        if(req.user.id == req.params.id){
            // let isupdated = await User.findByIdAndUpdate(req.params.id, req.body);
            // return res.redirect('back');
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){
                    console.log("***Multer error");
                }
                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){
                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
        }
        else{
            req.flash('error', 'Unaithorized!')
            res.status(401).send('Unauthorized');
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}


//rendering the sign up page
module.exports.signUp = function(req, res){
    try{
        if(req.isAuthenticated()){
            return res.redirect('/users/profile');
        }
        return res.render('user_sign_up', {
            title: "Sign Up to Linkify"
        })
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}

//rendering the sign in page
module.exports.signIn = function(req, res){
    try{
        if(req.isAuthenticated()){
            return res.redirect('/users/profile');
        }
        return res.render('user_sign_in', {
            title: "Sign In to Linkify"
        })
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
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
        console.log(err);
        return res.redirect('back');
    }
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}


module.exports.destroySession = function(req, res){
    try{
        req.logout((err) => {
            if (err) {
            console.error(err);
            return res.status(500).send("Something went wrong");
            }
            req.flash('success', 'Logged out Successfully');
            return res.redirect("/");
        });
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}