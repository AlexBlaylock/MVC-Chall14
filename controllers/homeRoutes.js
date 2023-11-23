const { Post, User } = require("../models");
const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const isLoggedIn = req.session.logged_in;
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        }
      ],
      order: [["createdAt", "DESC"]]
    });
    
    console.log('Posts:', postData);
    const posts = postData.map(post => post.get({ plain: true }));
    
    res.render('homepage', { isLoggedIn, posts });
  } catch (err) {
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

// i used mini proj 14 as a frame, replaced stuff to suit this challenge. also used 