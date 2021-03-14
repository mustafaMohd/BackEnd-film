const roles = ['user', 'admin'];

const roleRights = new Map();
roleRights.set(roles[0], ['comment']);
roleRights.set(roles[1], ['comment', 'getUsers', 'manageUsers']);

module.exports = {
  roles,
  roleRights,
};
