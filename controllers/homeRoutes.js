const { Post, User } = require("../models");
const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Retrieve 'logged_in' status from session and assign it to isLoggedIn
    const isLoggedIn = req.session.logged_in;

    // console.log('isLoggedIn:', isLoggedIn);
    // console.log('Full session:', req.session);

    // Fetch posts data from the database
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    // Convert posts data to a plain format
    const posts = postData.map(post => post.get({ plain: true }));

    // Render the homepage template with isLoggedIn and posts data
    res.render('homepage', { isLoggedIn, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get('/signin', (req, res) => {
  res.render('signin', { layout: 'main' });
});

router.get('/signup', (req, res) => {
  res.render('signup', { layout: 'main' });
});

module.exports = router;