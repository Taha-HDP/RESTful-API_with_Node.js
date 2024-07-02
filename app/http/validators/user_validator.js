const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const loginValidator = (data) => {
  const schema = Joi.object({
    input: Joi.string().required().pattern(/^[^:|{}/;,\'"]*$/).message('input cannot contain : [] | / ; , \' "'),
    password: Joi.string().required().pattern(/^[^:|{}/;,\'"]*$/).message('password cannot contain : [] | / ; , \' "'),
  });
  return schema.validate(data);
};
const registerValidator = (data) => {
  const schema = Joi.object({
    phone: Joi.string().length(11).pattern(/^[0-9]+$/).required().messages({
      'string.pattern.base': 'phone must be a number',
      'string.empty': 'phone is required.',
      'any.required': 'phone is required.',
    }),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^:|{}/;,\'"]{8,}$/).required().messages({
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one digit and minimum length of 8 characters, and cannot contain : [] | / ; , \' "',
      'string.empty': 'Password is required.',
      'any.required': 'Password is required.',
    }),
    username: Joi.string().required().pattern(/^[^:|{}/;,\'"]*$/).message('Username cannot contain : [] | / ; , \' "'),
  });
  return schema.validate(data);
};
const editValidator = (data) => {
    const schema = Joi.object({
      phone: Joi.string().length(11).pattern(/^[0-9]+$/).messages({
        'string.pattern.base': 'phone must be a number',
        'string.empty': 'phone is required.',
        'any.required': 'phone is required.',
      }),
      password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^:|{}/;,\'"]{8,}$/).messages({
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one digit and minimum length of 8 characters, and cannot contain : [] | / ; , \' "',
      'string.empty': 'Password is required.',
      'any.required': 'Password is required.',
    }),
      username: Joi.string().pattern(/^[^:|{}/;,\'"]*$/).message('Username cannot contain : [] | / ; , \' "'),
      address: Joi.string().pattern(/^[^:|{}/;,\'"]*$/).message('address cannot contain : [] | / ; , \' "'),
    }).or('username', 'password', 'phone', 'address').min(1);;
    return schema.validate(data);
  };
module.exports = { registerValidator, loginValidator , editValidator };
