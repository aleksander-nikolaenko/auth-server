const updateTokens = async user => {
  const { accessToken, refreshToken } = user.createTokens();
  user.token = refreshToken;
  await user.save();
  return { accessToken, refreshToken };
};

module.exports = updateTokens;
