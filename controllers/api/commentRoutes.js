// importing
const { Comment } = require('../../models');
const router = require('express').Router();
const withAuth = require('../../utils/auth');

// GET all comments
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.findAll();
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET comment by ID
router.get('/:id', async (req, res) => {
  try {
    const comment = await Comment.findByPk(Number(req.params.id));
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT update comment by ID
router.put('/:id', withAuth, async (req, res) => {
  try {
    const comment = await Comment.findByPk(Number(req.params.id));
    if (!comment || comment.user_id !== req.session.user_id) {
      return res.status(403).json({ message: 'Comment not yours' });
    }

    const [updatedCount] = await Comment.update(req.body, {
      where: { id: Number(req.params.id) },
    });

    if (updatedCount > 0) {
      res.status(200).json({ message: 'Comment updated successfully' });
    } else {
      res.status(404).json({ message: 'Comment not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE comment by ID
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const comment = await Comment.findByPk(Number(req.params.id));
    if (!comment || comment.user_id !== req.session.user_id) {
      return res.status(403).json({ message: 'Comment not yours' });
    }

    await comment.destroy();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;