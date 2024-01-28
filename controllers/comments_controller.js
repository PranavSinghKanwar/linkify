const Comment = require('../models/comment');
const Post = require('../models/posts');

module.exports.create = async function(req, res){
    try{
        let post = await Post.findById(req.body.post).populate('comments');

        if(post){
            const comment = await Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: req.body.post
            });
            post.comments.push(comment);
            post.save();

            res.redirect('/');
        }
    }
    catch(err){
        console.log(err);
        res.redirect('/');
    }
}