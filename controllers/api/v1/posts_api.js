const Post = require("../../../models/posts");
const Comment = require("../../../models/comment");

module.exports.index = async function(req, res){
    let post_list = await Post.find({}).populate('user').populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    });
    
    return res.json(200, {
        message: "List of posts",
        posts: post_list
    });
}

module.exports.destroy = async function(req, res){
    try{
        let delPost = await Post.findById(req.params.id);
        
        // .id means converting the object id into string
        if(delPost.user == req.user.id){
            let deleted = await Post.findByIdAndDelete(req.params.id);
            let deletedComments = await Comment.deleteMany({post: req.params.id});

            //req.flash('success', 'Post and associated comments deleted');
            return res.json(200, {
                message: "Post and associated comments deleted successfully"
            });
        }  
        else{
            return res.json(401, {
                message: "You cannot delete this post"
            })
        }
    }
    catch(err){
        console.log(err);
        return res.json(500, {
            message: "Internal Server Error"
        })
    }
}