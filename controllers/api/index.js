// import express
const router = require('express').Router();
// import routes
const commentRoutes = require('./commentRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const postRoutes = require('./postRoutes');
const userRoutes = require('./userRoutes');



// router using routes
router.use('/comments', commentRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/posts', postRoutes);
router.use('/users', userRoutes);

module.exports = router;

// i imagine my issue is in here, just really unable to figure it out. my routes go to the right files, but when trying to render them using handlebars they just constantly 404.