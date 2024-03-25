const { hash } = require('bcryptjs');
const { v4: generateId } = require('uuid');

const { NotFoundError } = require('../util/errors');
const { readData, writeData } = require('./util');

const db = require('../dbConnection');

async function add(data) {
  const userId = generateId();
  const { email = '', password = '' } = data;
  const hashedPw = await hash(password, 12);
  const { results } = await db.query(`
  INSERT INTO user (id, email, password)
    VALUES (?, ?, ?);
`,
  [userId, email, hashedPw]
);
  return { id: userId, email: data.email };
}

async function get(email) {
  const { results } = await db.query(
    'SELECT * FROM user WHERE email=?',
    [email],
);
  if (results.length === 0) {
    throw new NotFoundError('Could not find any users.');
  }
console.log(results)
  return results;
}

exports.add = add;
exports.get = get;
