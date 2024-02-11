const express = require('express');
const router = express.Router();
const passport = require('passport');

const friendController = require('../controllers/friend_controller');

// Send a friend request
router.post('/friendship/add', passport.checkAuthentication, friendController.addFriend);

router.get('/friendship/remove/:id', passport.checkAuthentication, friendController.removeFriend);

module.exports = router;