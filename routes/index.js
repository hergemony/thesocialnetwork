const router = require('express').Router();
const userRoute = require('./api/users-route');
const thoughtRoute = require('./api/thoughts-route');

router.use('/users', userRoute);
router.use('/thoughts', thoughtRoute);

module.exports = router;