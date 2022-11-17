const isPhone = value => {
  const phoneRegexp = /^\+?[0-9]?[0-9]?([0-9]{10})$/;
  return value.match(phoneRegexp);
};
module.exports = isPhone;
