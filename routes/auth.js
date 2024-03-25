const express = require('express');
const { add, get } = require('../data/user');
const { createJSONToken, isValidPassword, validateJSONToken } = require('../util/auth');
const { v4: generateId } = require('uuid');
const db = require('../dbConnection');
const { verify } = require('jsonwebtoken');

const router = express.Router();

router.post('/api/signup', async (req, res, next) => {
  const data = req.body;
  try {
    const createdUser = await add(data);
    const authToken = createJSONToken(createdUser.email);
    res
      .status(201)
      .json({ message: 'User created.', user: createdUser, token: authToken });
  } catch (error) {
    next(error);
  }
});

router.post('/api/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  let user;
  try {
    user = await get(email);
    console.log(user[0].password)
  } catch (error) {
    console.log(error)
    return res.status(401).json({ message: 'Authentication failed.' });
  }

  const pwIsValid = await isValidPassword(password, user[0].password);
  if (!pwIsValid) {
    return res.status(422).json({
      message: 'Invalid credentials.',
      errors: { credentials: 'Invalid email or password entered.' },
    });
  }

  const token = createJSONToken(email);
  res.json({ token });
});

router.get('/api/listings', async (req, res) => {
  try {
    const { results } = await db.query('SELECT * FROM listings');
    res.json(results);
  } catch (error) {
    console.error('Error querying the database:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.get('/api/myAds', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    const decodedToken = validateJSONToken(token);
    const userId = decodedToken.email;
    const { results } = await db.query('SELECT * FROM listings where user_id = ?', [userId]);
    res.json(results);
  } catch (error) {
    console.error('Error querying the database:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.get('/api/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { results } = await db.query('SELECT * FROM listings where id = ?', [id]);
  await db.query('UPDATE listings SET views = views + 1 WHERE id = ?', [id]);
    res.json(results);
  } catch (error) {
    console.error('Error querying the database:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.delete('/api/listings/:id', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    const decodedToken = validateJSONToken(token);
    const { id } = req.params;
    const userId = decodedToken.email;
    const { results } = await db.query('DELETE FROM listings where id = ? AND user_id=?', [id,userId]);
    res.status(200).json(results);    
  } catch (error) {
    console.error('Error querying the database:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/api/listings', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];
  const decodedToken = validateJSONToken(token);
  const id = generateId();
  const { name = '', description = '', price = 0 } = req.body;
  const userId = decodedToken.email;
  const views = 0;

  await db.query(`
      INSERT INTO listings (id, name, description, price, user_id, views)
        VALUES (?, ?, ?, ?, ?, ?);
  `,
      [id, name, description, price, userId, views]
  );
  res.status(200).json({message: 'Ad created!'})
});
module.exports = router;
