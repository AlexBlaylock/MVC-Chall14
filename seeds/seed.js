const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');
const userData = require('./userData.json');
const postData = require('./postData.json');
const commentData = require('./commentData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const posts = await Post.bulkCreate(postData);

  for (const comment of commentData) {
    const randomUserIndex = Math.floor(Math.random() * users.length);
    const randomPostIndex = Math.floor(Math.random() * posts.length);

    comment.user_id = users[randomUserIndex].id;
    comment.post_id = posts[randomPostIndex].id;
  }

  await Comment.bulkCreate(commentData);

  process.exit(0);
};

seedDatabase();

// seeded data for testing