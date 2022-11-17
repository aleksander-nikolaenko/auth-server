const isEmail = value => {
  const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return value.match(emailRegexp);
};
module.exports = isEmail;
