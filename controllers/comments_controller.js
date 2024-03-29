const Comment = require('../models/comment');
const Post = require('../models/posts');
const commentsMailer = require("../mailers/comments_mailer")


module.exports.create = async function(req, res){
    try{
        let post = await Post.findById(req.body.post).populate('comments');

        if(post){
            // Create a new comment and save it
            const comment = await Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: req.body.post
            });
            post.comments.push(comment);
            post.save();
            
            // Populate the user field and assign it to the same variable
            const populatedComment = await Comment.findById(comment._id).populate('user', 'name email');
            commentsMailer.newComment(populatedComment);
            res.redirect('/');
        }

    }
    catch(err){
        console.log(err);
        res.redirect('/');
    }
}


module.exports.destroy = async function(req, res){
    try{
        let commToDelete = await Comment.findById(req.params.id);

        if(commToDelete.user == req.user.id){
            let postId = commToDelete.post;
            let isCommentDeleted = await Comment.findByIdAndDelete(req.params.id);
            
            let postWithComment = await Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}});

            return res.redirect('back');
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