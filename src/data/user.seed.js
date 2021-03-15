const bcrypt = require('bcryptjs');

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: hashedPassword,
    role: 'admin',
  },
  {
    name: 'User',
    email: 'user@example.com',
    password: hashedPassword,
    role: 'user',
  },
];
module.exports = {
  users,
};
