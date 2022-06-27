const Thought = require('../models/thought');
const User = require('../models/user');
const Reaction = require('../models/reaction');

const thoughtController  = {
    // retrieve all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
        .populate({
            path: 'user',
            select: '-__v'
        })
        .select('-__v')
        .sort ({ _id: -1 })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400)
        });
    },
    // create thought
    createThought({ params, body }, res) {
        return Thought.create(body)
        .then(({ _id}) => {
            return User.findOneAndUpdate(
                { username: body.username},
                { $addToSet: { thoughts: _id }},
                { new: true}
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(400).json({ message: 'No user found with this name'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
        
    },
    // retrieve thought by ID
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({
            path: 'user',
            select: '-__v'
        })
        
        .select('-__v')
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        });  
    },
    // delete thought
    deleteThought ({ params }, res) { 
        Thought.findOneAndDelete({ _id: params.id })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(400).json({ message: 'No thought found with this id!'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err))
    },
    // update thought
    updateThought ({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id}, body, {new: true })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(400).json({ message: 'No thoughts found with this id!'});
                return;
            }
            res.json(dbThoughtData)
        })
        .catch(err => res.status(400).json(err));
    },

    // add reaction
    addReaction ({ params, body }, res) {
         Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body } },
            { new: true}
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(400).json({ message: "No thought found with this id number"});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(500).json(err))
    },
     // remove reaction
     deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: {reactions: params.reactionId} },
            {new: true }
        )
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.json(err));
    }
}

module.exports = thoughtController;