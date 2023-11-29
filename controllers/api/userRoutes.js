// importing
const { User, Post } = require('../../models');
const router = require('express').Router();

// GET all users
router.get('/', async (req, res) => {
  try {
    // fetches all users from the database
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
    // creates new user with a post request
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
  // console log for debugging, was having issues with logging in
  console.log('Login route hit');
  console.log('Request body:', req.body);
  try {
    const { username, password } = req.body;
    // finds user by their username
    const user = await User.findOne({
      where: { username },
    });

    // error if unable to find user or their password verification fails
    if (!user || !user.checkPassword(password)) {
      res.status(400).json({ message: 'Invalid username or password' });
      return;
    }

    req.session.save(() => {
      // session saves when when logged in
      req.session.user_id = user.id;
      req.session.logged_in = true;
      // more console logs for debugging
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
    // destroys session on log out
    req.session.destroy(() => res.status(204).json({ isLoggedIn: false }));
  } else {
    res.status(404).json({ isLoggedIn: false });
  }
});

module.exports = router;