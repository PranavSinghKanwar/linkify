const Post = require('../models/posts');
const User = require('../models/user');
const Friendship = require('../models/friendship');
module.exports.home = async function(req,res){
    try{
        let post_list = await Post.find({}).populate('user').populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });
        let user_list = await User.find({});
        let friendlist = await Friendship.find({ from_user: req.user })
        .populate({
            path: 'to_user',
            populate: {
                path: 'name'
            }
        })
        return res.render('home', {
            title:"Home",
            posts: post_list,
            all_users: user_list,
            all_friends: friendlist
        });
    }
    catch(err){
        console.log(err);
    }
}