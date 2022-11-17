const { Schema, model } = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { isEmail, isPhone } = require('../helpers');

const passwordRegexp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

const authSchema = new Schema(
  {
    id: {
      type: String,
      required: [true, 'id is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'password is required'],
    },

    id_type: {
      type: String,
      enum: {
        values: ['phone', 'email'],
        message:
          "{VALUE} is not supported, have to choose between 'phone' or 'email' ",
      },
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true },
);

authSchema.methods.createTokens = function () {
  const payload = {
    id: this.id,
  };

  return {
    accessToken: jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME,
    }),
    refreshToken: jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME,
    }),
  };
};

const signinAndSignupSchema = Joi.object({
  id: Joi.string()
    .custom((value, helpers) => {
      if (isEmail(value)) {
        return value;
      } else if (isPhone(value)) {
        return value;
      }
      return helpers.message({
        custom:
          'Invalid field id. Id must be email (user@example.com) or phone number(+380123456789)',
      });
    })
    .required()
    .messages({
      'string.base':
        'Sorry! It looks like something went wrong. Please try later.',
      'string.empty': 'Id is not allowed to be empty',
    }),

  password: Joi.string()
    .regex(passwordRegexp)
    .min(6)
    .max(50)
    .required()
    .messages({
      'string.base':
        'Sorry! It looks like something went wrong. Please try later.',
      'string.pattern.base':
        'Password must contain 6 to 50 letters and numbers',
      'string.empty': 'Password is not allowed to be empty',
      'string.min': 'Email length must be at least 6 characters long',
      'string.max':
        'Password length must be less than or equal to 50 characters long',
    }),
});

// const logoutSchema=

const joiSchemas = {
  signinAndSignup: signinAndSignupSchema,
  // logout: logoutSchema,
};

const User = model('user', authSchema);

module.exports = {
  User,
  joiSchemas,
};
