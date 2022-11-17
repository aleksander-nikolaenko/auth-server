const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require('../auth/service');
const { createError, updateTokens } = require('../helpers');

class AuthController {
  signin = async (req, res) => {
    const { id, password } = req.body;
    const user = await userService.getUserById(id);
    if (!user) {
      throw createError(403, 'Id or password wrong');
    }
    const passCompare = bcrypt.compareSync(password, user.password);
    if (!passCompare) {
      throw createError(403, 'Id or password wrong');
    }
    const { accessToken, refreshToken } = await updateTokens(user);
    res.status(200).json({
      message: 'Login Success',
      accessToken,
      refreshToken,
    });
  };

  signup = async (req, res) => {
    const { id, password } = req.body;
    const user = await userService.getUserById(id);
    if (user) {
      throw createError(409, `Id is already used`);
    }
    const hashPassword = bcrypt.hashSync(
      password,
      Number(process.env.HASH_POWER),
    );
    const newUser = await userService.addUser({
      id,
      password: hashPassword,
    });
    const { accessToken, refreshToken } = await updateTokens(newUser);

    res.status(201).json({
      message: 'Registration Success',
      accessToken,
      refreshToken,
    });
  };

  info = async (req, res) => {
    const user = await userService.getUserById(req.user.id);
    if (!user) {
      throw createError(404);
    }

    res.status(200).json({
      message: 'Get Info Success',
      id: user.id,
      id_type: user.id_type,
    });
  };

  logout = async (req, res) => {
    const { id } = req.user;
    const { all = false } = req.query;
    all
      ? await userService.updateAllUsersToken(null)
      : await userService.updateUserTokenById(id, null);

    res.status(204).send();
  };

  refresh = async (req, res) => {
    const authorizationHeader = req.get('Authorization');
    try {
      if (authorizationHeader) {
        const [bearer, token] = authorizationHeader.split(' ');
        if (bearer !== 'Bearer') {
          throw createError(401, 'Not authorized');
        }
        const { id } = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        const user = await userService.getUserById(id);

        if (!user || user.token !== token) {
          throw createError(401, 'Not authorized');
        }
        const { accessToken, refreshToken } = await updateTokens(user);
        res.status(200).json({
          message: 'Refresh Success',
          accessToken,
          refreshToken,
        });
      } else {
        throw createError(400, 'Missing refresh token');
      }
    } catch (error) {
      throw createError(401, error.message);
    }
  };
}
module.exports = new AuthController();
