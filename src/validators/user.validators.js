import body from 'express-validator';
import validationMessage from '../messages/validation.json';

exports.validateUserRegistration = [
  body('email').notEmpty().withMessage(validationMessage.general.emailRequired),
  body('password')
    .notEmpty()
    .withMessage(validationMessage.general.passwordRequired),
  body('contact_number')
    .notEmpty()
    .withMessage(validationMessage.general.contactNumberRequired),
  body('first_name')
    .notEmpty()
    .withMessage(validationMessage.general.firstRequired),
  body('last_name')
    .notEmpty()
    .withMessage(validationMessage.general.lastRequired),
];
