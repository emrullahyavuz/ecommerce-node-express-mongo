const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).messages({
    'string.empty': 'İsim alanı boş bırakılamaz',
    'string.min': 'İsim en az 2 karakter olmalıdır',
    'string.max': 'İsim en fazla 50 karakter olabilir'
  }),
  email: Joi.string().email().messages({
    'string.email': 'Geçerli bir email adresi giriniz',
    'string.empty': 'Email alanı boş bırakılamaz'
  }),
  currentPassword: Joi.string().when('newPassword', {
    is: Joi.exist(),
    then: Joi.required().messages({
      'any.required': 'Yeni şifre belirlemek için mevcut şifrenizi girmelisiniz'
    })
  }),
  newPassword: Joi.string().min(6).messages({
    'string.min': 'Yeni şifre en az 6 karakter olmalıdır',
    'string.empty': 'Yeni şifre alanı boş bırakılamaz'
  }),
  confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).when('newPassword', {
    is: Joi.exist(),
    then: Joi.required().messages({
      'any.only': 'Şifreler eşleşmiyor',
      'any.required': 'Yeni şifre tekrarı zorunludur'
    })
  })
}).min(1).messages({
  'object.min': 'En az bir alan güncellenmelidir'
});

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });
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
  validateUser
}; 