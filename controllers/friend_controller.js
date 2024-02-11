// const User = require('../models/user');
// const Friendship = require('../models/friendship');

// // Send a friend req
// module.exports.addFriend = async function(req, res){
//   try{
//       console.log('inside friend controller');
//       // console.log('query',req.query);
//       // const { fromUserId, toUserId } = req.query;
//       const fromUserId = req.user.id;
//       const toUserId = req.query.toUser;

//       let existingFriend = await Friendship.findOne({
//         to_user: toUserId
//       });

//       if(!existingFriend) {
//         // create a new friendship req
//         const friendship = new Friendship({
//           from_user: fromUserId,
//           to_user: toUserId
//         });

//         // save the friendship req
//         await friendship.save();

        
//         // add a friend to friendlist of the from_user
//         const fromUser = await User.findById(fromUserId);
//         fromUser.friendships.push(friendship._id);

//         const toUser = await User.findById(toUserId);
//         toUser.friendships.push(friendship._id);

//         await Promise.all([fromUser.save(), toUser.save()]);

//         if(req.xhr){
//           return res.status(200).json({
//             message: 'Friend req sent successfully',
//             data: {
//               fromUser: fromUser,
//               toUser: toUser
//             }
//           })
//         }

//     }else{
//       console.log('existing friend');
//       return res.status(400).json({ message: 'This user is already your friend. Do you want to remove them?' });
//     }

    
//   }catch(err){
//     return res.status(500).json({ error: 'Something wet wrong'});
//   }
// }

// module.exports.removeFriend = async function(req, res){
//   try {
//     console.log('Inside remove friend module');

//     // console.log('req::::::', req.user);
//     // console.log('friend params', req.params.id);
    
//     const friendDelete = await Friendship.findById(req.params.id);

//     if(friendDelete){
//       friendDelete.remove();
//       const userWithFriend = await User.find({friendships: req.params.id})

//       for (const user of userWithFriend) {
//         user.friendships.pull(req.params.id);
//         await user.save();
//       }


//       if (req.xhr){
//         return res.status(200).json({
//             data: {
//                 to_user: req.params.id
//             },
//             message: "Friend deleted"
//         });
//       }
//     }
    
    
//   } catch (error) {
//     console.log('errir in delete friend',error);
//   }
// }

const User = require('../models/user');
const Friendship = require('../models/friendship');

// Send a friend req
module.exports.addFriend = async function(req, res){
  try{
    console.log('inside friend controller');
    const fromUserId = req.user.id;
    const toUserId = req.query.toUser;

    let existingFriend = await Friendship.findOne({
      to_user: toUserId
    });

    if(!existingFriend) {
      // create a new friendship req
      const friendship = new Friendship({
        from_user: fromUserId,
        to_user: toUserId
      });

      // save the friendship req
      await friendship.save();

      // add a friend to the friendlist of the from_user
      const fromUser = await User.findById(fromUserId);
      fromUser.friendships.push(friendship._id);

      const toUser = await User.findById(toUserId);
      toUser.friendships.push(friendship._id);

      await Promise.all([fromUser.save(), toUser.save()]);

      if(req.xhr){
        // return res.redirect('back');
        return res.status(200).json({
          message: 'Friend req sent successfully',
          data: {
            fromUser: fromUser,
            toUser: toUser
          }
        });
      }
    } else {
      return res.redirect('back');
    }
  } catch(err) {
    console.error('Error in addFriend:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports.removeFriend = async function(req, res){
  try {
    console.log('Inside remove friend module');

    const friendToDelete = await Friendship.findOneAndDelete({ _id: req.params.id });

    if (friendToDelete) {
      const userWithFriend = await User.find({ friendships: req.params.id });

      for (const user of userWithFriend) {
        user.friendships.pull(req.params.id);
        await user.save();
      }

      if (req.xhr){
        return res.status(200).json({
          data: {
            to_user: req.params.id
          },
          message: 'Friend deleted'
        });
        return res.redirect('back');
      }
    } else {
      res.redirect('back');
    }
  } catch (error) {
    console.error('Error in removeFriend:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
