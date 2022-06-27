const router = require('express').Router();

const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend
} = require('../../controllers/user-controller');

// /api/user
router
    .route('/')
    .get(getAllUsers)
    .post(createUser)

// /api/user/:id
router  
    .route('/:id')
    .get(getUserById)
    .delete(deleteUser)
    .put(updateUser)
router
    .route('/:userId/friends/:friendId')
    .post(addFriend)
    .delete(deleteFriend)

module.exports = router;