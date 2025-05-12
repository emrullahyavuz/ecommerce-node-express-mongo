const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'İsim alanı boş bırakılamaz',
    'string.min': 'İsim en az 2 karakter olmalıdır',
    'string.max': 'İsim en fazla 50 karakter olabilir',
    'any.required': 'İsim alanı zorunludur'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Geçerli bir email adresi giriniz',
    'string.empty': 'Email alanı boş bırakılamaz',
    'any.required': 'Email alanı zorunludur'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Şifre alanı boş bırakılamaz',
    'string.min': 'Şifre en az 6 karakter olmalıdır',
    'any.required': 'Şifre alanı zorunludur'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Şifreler eşleşmiyor',
    'any.required': 'Şifre tekrarı zorunludur'
  })
});

const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'Kullanıcı adı alanı boş bırakılamaz',
    'any.required': 'Kullanıcı adı alanı zorunludur'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Geçerli bir email adresi giriniz',
    'string.empty': 'Email alanı boş bırakılamaz',
    'any.required': 'Email alanı zorunludur'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Şifre alanı boş bırakılamaz',
    'any.required': 'Şifre alanı zorunludur'
  })
});

const validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errorMessage
    });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errorMessage
    });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin
}; 