const nodemailer = require("../config/nodemailer");


module.exports.newComment = function(comment){
    let htmlString = nodemailer.renderTemplate({comment:comment}, '/comments/new_comment.ejs');
    nodemailer.transporter.sendMail({
        from: 'kingbaroushouei1@gmail.com',
        to: comment.user.email,
        subject: "New Comment Published!",
        html: htmlString
    }, function(err, info){
        if(err){
            console.log('error in sending mail', err);
            return;
        }
        console.log('mail sent', info);
        return;
    })
}