// importing
const { User, Comment, Post } = require('../../models');
const router = require('express').Router();
const withAuth = require('../../utils/auth');

// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [Comment],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET single post by ID
router.get('/:id', async (req, res) => {
  try {
    const logInStatus = req.session.logged_in;
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
    res.render('post', { posts, logInStatus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST new comment for post
router.post('/:id', withAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const newComment = await Comment.create({
      ...req.body,
      post_id: Number(id),
      user_id: req.session.user_id,
    });
    res.redirect(req.get('referer'));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT update post by ID
router.put('/:id', withAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const findPost = await Post.findByPk(Number(id));

    if (!findPost || findPost.user_id !== req.session.user_id) {
      return res.status(403).json({ message: 'Forbidden: Post not yours' });
    }

    const [updatedCount] = await Post.update(req.body, {
      where: { id: Number(id) },
    });

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
    const { id } = req.params;
    const post = await Post.findByPk(Number(id));

    if (!post || post.user_id !== req.session.user_id) {
      return res.status(403).json({ message: 'Forbidden: Post not yours' });
    }

    await post.destroy();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;