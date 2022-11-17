const express = require('express');
const { ctrlWrapper } = require('../helpers');
const ctrlAuth = require('./controller');
const { validation, auth } = require('../middleware');
const { joiSchemas } = require('./model');

const router = express.Router();

router.post(
  '/signin',
  validation(joiSchemas.signinAndSignup),
  ctrlWrapper(ctrlAuth.signin),
);

router.post(
  '/signup',
  validation(joiSchemas.signinAndSignup),
  ctrlWrapper(ctrlAuth.signup),
);

router.post('/refresh-token', ctrlWrapper(ctrlAuth.refresh));

router.get('/info', auth, ctrlWrapper(ctrlAuth.info));

router.get('/logout', auth, ctrlWrapper(ctrlAuth.logout));

module.exports = router;
