const { User, Thought } = require('../models/index');
//const User = require('../models/user');
//const Thought = require('../models/thought');


const userController = {

    //get all users
    getAllUsers(req,res) {
        User.find({})
        .populate({
            path: 'thoughts',
            select: '-__v'
          })
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
        
    },
    
    // create user
    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => res.sendStatus(200))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },
    // get user by id
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
           .populate({
               path: 'thoughts',
               select: '-__v'
            })
            .populate ({
                path: 'friends',
                select: '-__v'
            })
           .select('-__v')
           .then(dbUserData => res.json(dbUserData))
           .catch(err => {
               console.log(err)
               res.status(400).json(err)
            
        });
        
    },
        // delete user
        deleteUser ({ params }, res) {
            User.findOneAndDelete({ _id: params.id })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err))
        },
        // update user
        updateUser ({ params, body }, res) {
            User.findOneAndUpdate({ _id: params.id }, body, { new: true })
            
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(400).json({ message: 'No users found with this id!'});
                    return;
                }
                res.json(dbUserData)
            })
            .catch(err => res.status(400).json(err));
        },
        
        // add friend
        addFriend({ params }, res) {
            User.findOneAndUpdate(
                { _id: params.userId},
                { $addToSet: { friends: params.friendId }},
                { new: true }
            )
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({ message: 'No user found with this user id!'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
        },
        
        // remove friend
        deleteFriend({ params }, res) {
            User.findOneAndUpdate(
                { _id: params.userId },
                { $pull: {friends: params.friendId} },
                {new: true }
            )
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.json(err));
        }
    }
module.exports = userController;