// importing
const { User, Comment, Post } = require('../../models');
const router = require('express').Router();
const withAuth = require('../../utils/auth');

// GET user dashboard 
// tried changing name of file, maybe this was the issue? does not seem to be it, still will not even console log in my terminal
router.get('/dashboard', async (req, res) => {
  // console log to try and find out why my route wont hit
  console.log("Dashboard route handler reached");
  // if not logged in, goes to signin
  if (!req.session.logged_in) {
    res.redirect('/signin');
    return;
  }

  try {
    // shows a users posts in the dashboard
    const userId = req.session.user_id; 
    const user = await User.findByPk(userId, {
      include: [Post],
    });

    if (!user) {
      res.status(404).send('User not found');
      return;
    }

    // renders dashboard handlebar if it worked
    res.render('dashboardZ', { 
      isLoggedIn: req.session.logged_in, 
      user: user.get({ plain: true }) 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET all posts
// router.get('/', async (req, res) => {
//   try {
//     const posts = await Post.findAll({
//       include: [Comment],
//     });
//     res.status(200).json(posts);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// GET post by ID
router.get('/:id', async (req, res) => {
  try {
    // login checker
    const isLoggedIn = req.session.logged_in;
    // finds post by id and user and comments on post
    const postData = await Post.findByPk(Number(req.params.id), {
      include: [
        { model: Comment, include: [{ model: User }] },
        { model: User },
      ],
    });

    if (!postData) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const posts = [postData].map(post => post.get({ plain: true }));
    // renders post template
    res.render('post', { posts, isLoggedIn });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST new comment
router.post('/:id', withAuth, async (req, res) => {
  try {
    // creates new comment under a post
     await Comment.create({
      ...req.body,
      post_id: Number(req.params.id),
      user_id: req.session.user_id,
    });
    // redirects to post
    res.redirect(req.get('referer'));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT update post by ID
router.put('/:id', withAuth, async (req, res) => {
  try {
    // finds post to update by id
    const findPost = await Post.findByPk(Number(req.params.id));
    // if post is not yours it 403s
    if (!findPost || findPost.user_id !== req.session.user_id) {
      return res.status(403).json({ message: 'Post not yours' });
    }

    // updates post with new data
    const [updatedCount] = await Post.update(req.body, {
      where: { id: Number(req.params.id) },
    });

    // 404s if update didn't happen
    if (updatedCount === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.redirect(req.get('referer'));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE post by ID
router.delete('/:id', withAuth, async (req, res) => {
  try {
    // finds post by id
    const post = await Post.findByPk(Number(req.params.id));
    // 403s if post is not yours (doesnt match user id for the session)
    if (!post || post.user_id !== req.session.user_id) {
      return res.status(403).json({ message: 'Post not yours' });
    }

    await post.destroy();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;