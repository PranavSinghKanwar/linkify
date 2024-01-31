const Post = require('../models/posts');
const Comment = require('../models/comment');

module.exports.create = async function(req, res){
    try{
        let newPost = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        req.flash('success', 'Post published');
        return res.redirect('back');
    }
    catch(err){
        req.flash('error', err);
        console.log('error in creating a post');
        return redirect('back');
    }
}

module.exports.destroy = async function(req, res){
    try{
        let delPost = await Post.findById(req.params.id);
        
        // .id means converting the object id into string
        if(delPost.user == req.user.id){
            let deleted = await Post.findByIdAndDelete(req.params.id);
            let deletedComments = await Comment.deleteMany({post: req.params.id});
            req.flash('success', 'Post and associated comments deleted');
            return res.redirect('back');
        }  
        else{
            req.flash('error', 'You cannot delete this post')
            return res.redirect('back');
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}