const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const router = require('./controllers');
const path = require('path');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({
  layoutsDir: path.join(__dirname, 'views/layouts'),
  helpers: { withAuth: require('./utils/auth')}
});

const sess = {
  secret: 'Super secret secret',
  cookie: { 
    maxAge: 300000,
    false: true,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));
app.set('view engine', 'handlebars');
app.engine('handlebars', hbs.engine);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));

// Set the template engine to render views from the views directory with our routes defined in /controllers.
app.use(router);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on ${PORT}`));
});
// took from mini proj 14
// also had help from Andrew Mell in my class with this serverjs