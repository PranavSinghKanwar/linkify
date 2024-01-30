const Post = require('../models/posts');
const Comment = require('../models/comment');

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

module.exports.destroy = async function(req, res){
    try{
        let delPost = await Post.findById(req.params.id);
        
        // .id means converting the object id into string
        if(delPost.user == req.user.id){
            let deleted = await Post.findByIdAndDelete(req.params.id);
            let deletedComments = await Comment.deleteMany({post: req.params.id});
            res.redirect('back');
        }  
        else{
            return res.redirect('back');
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}