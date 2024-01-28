const Post = require('../models/posts');

module.exports.create = async function(req, res){
    try{
        let newPost = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        return res.redirect('back');
    }
    catch(err){
        console.log('error in creating a post');
        return;
    }
}