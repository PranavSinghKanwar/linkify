const Post = require('../models/posts');


module.exports.home = async function(req,res){
    
    let post_list = await Post.find({}).populate('user').populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    });

    return res.render('home', {
        title:"Home",
        posts: post_list
    });
}