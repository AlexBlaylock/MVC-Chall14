const router = require('express').Router();
const { Comment } = require('../../models');

// get all comments
router.get("/", async (req, res) => {
    try {
      const comments = await Comment.findAll();
      res.status(200).json(comments);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  // get comment by id
  router.get("/:id", async (req, res) => {
    try {
      const comment = await Comment.findByPk(Number(req.params.id));
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.status(200).json(comment);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  // put for update comment
  router.put("/:id", async (req, res) => {
    try {
      const comment = await Comment.findByPk(Number(req.params.id));
      if (comment.user_id !== req.session.user_id) {
        return res.status(403).json({ message: "You don't have permission to update this comment." });
      }
  
      const [updatedRowCount] = await Comment.update(req.body, {
        where: { id: Number(req.params.id) },
      });
  
      if (updatedRowCount === 0) {
        return res.status(404).json({ message: "Comment not found" });
      }
  
      const updatedComment = await Comment.findByPk(Number(req.params.id));
      res.status(200).json(updatedComment);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  // delete comment
  router.delete("/:id", async (req, res) => {
    try {
      const comment = await Comment.findByPk(Number(req.params.id));
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      if (comment.user_id !== req.session.user_id) {
        return res.status(403).json({ message: "You don't have permission to delete this comment." });
      }
  
      await comment.destroy();
      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

module.exports = router;
