const { User } = require('../auth/model');
const { isEmail } = require('../helpers');

class UserService {
  addUser = user => {
    isEmail(user.id) ? (user.id_type = 'email') : (user.id_type = 'phone');
    const result = User.create(user);
    return result;
  };

  getUserById = userId => {
    const result = User.findOne({ id: userId }, '-createdAt -updatedAt');
    return result;
  };

  updateUserTokenById = async (userId, token) => {
    const result = await User.findOneAndUpdate({ id: userId }, { token });
    return result;
  };

  updateAllUsersToken = async token => {
    const result = await User.updateMany({}, { token });
    return result;
  };
}

module.exports = new UserService();
