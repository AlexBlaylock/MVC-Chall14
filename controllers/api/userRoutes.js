// importing
const { User, Post } = require('../../models');
const router = require('express').Router();

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST new user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    req.session.save(() => {
      req.session.user_id = user.id;
      req.session.logged_in = true;
      res.redirect('/');
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Bad Request' });
  }
});


// POST user login
router.post('/login', async (req, res) => {
  console.log('Login route hit');
  console.log('Request body:', req.body);
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      where: { username },
    });

    if (!user || !user.checkPassword(password)) {
      res.status(400).json({ message: 'Invalid username or password' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = user.id;
      req.session.logged_in = true;
      console.log("Session user_id:", req.session.user_id);
      console.log("Session logged_in:", req.session.logged_in);
      res.redirect('/');
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST user logout
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => res.status(204).json({ isLoggedIn: false }));
  } else {
    res.status(404).json({ isLoggedIn: false });
  }
});

module.exports = router;