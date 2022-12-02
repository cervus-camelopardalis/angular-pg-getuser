const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const pool = require('./db');

/* Middleware */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Routes */
/***************************************************/
/********************* Sign up *********************/
/***************************************************/
app.post('/users/signup', async(req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const email = req.body.email;
    const password = hashedPassword;
    
    const newUser = pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, password])
      .then (() => {
        res.status(201).json({ message: 'Sign up successful' });
      })
      .catch (err => {
        if (err.code === '23505') {
          res.status(409).json({ message: 'Email already exists in the database' });
        }
      });
  } catch {
    res.status(500).send();
  }
});

/***************************************************/
/********************* Sign in *********************/
/***************************************************/
app.post('/users/signin', async(req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const existingUsers = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = existingUsers.rows[0];

  if (user == undefined) {
    return res.status(400).json({ message: 'Incorrect e-mail' });
  }

  try {
    if (await bcrypt.compare(password, user.password)) {
      const email = req.body.email;
      const user = { email: email };
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res.status(200).json({ accessToken: accessToken });
    } else {
      return res.status(400).json({ message: 'Incorrect password.' });
    }
  } catch {
    res.status(500).send();
  }
});

/**************************************************/
/******************** Get user ********************/
/**************************************************/
/* Thunder Client: GET http://localhost:5000/users */
/* JSON: { "email": "bob@email.com", "password": "password123" } */
/* JSON: { "email": "alice@email.com", "password": "password123" } */
app.get('/users', verifyToken, async(req, res) => {
  /* If verifyToken doesn't return any error, it means that the token is valid and the user is set (req.user = user) */
  /* Goal: only return "user" that the user has access to */
  /* If Bob signs in --> show him his data (i.e., his e-mail and password) */
  /* If Alice signs in --> show her her data (i.e., her e-mail and password) */

  const email = req.user.email;

  var getAllExistingUsers = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  var user = getAllExistingUsers.rows[0].email;
  return res.status(200).json({ user });
});


function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  /* If we have an authHeader return the authHeader token portion (using split), otherwise return undefined */
  const token = authHeader && authHeader.split(' ')[1]; /* There's a space between BEARER and token like this: BEARER l345gteo43056450654n35ph350956u0... */

  /* If the user doesn't send the token... */
  if (token == null) {
    /* ...return an error */
    return res.sendStatus(401);
  }

  /* Verify the token (token and secret needed) */
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    /* If the token sent by the user is not valid... */
    if (err) {
      /* ...return an error */
      return res.sendStatus(403);
    }

    /* If the token sent by the user is valid... */
    /* ...set the user on request */
    req.user = user;
    next(); /* Move on from middleware */
  });
}

/* Set port and listen for requests */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});