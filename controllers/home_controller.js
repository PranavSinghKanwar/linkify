const Post = require('../models/posts');
const User = require('../models/user');

module.exports.home = async function(req,res){
    try{
        let post_list = await Post.find({}).populate('user').populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });
        let user_list = await User.find({});
        return res.render('home', {
            title:"Home",
            posts: post_list,
            all_users: user_list
        });
    }
    catch(err){
        console.log(err);
    }
}