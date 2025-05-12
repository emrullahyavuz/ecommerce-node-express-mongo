const Joi = require('joi');

const categorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Kategori adı boş bırakılamaz',
    'string.min': 'Kategori adı en az 2 karakter olmalıdır',
    'string.max': 'Kategori adı en fazla 50 karakter olabilir',
    'any.required': 'Kategori adı zorunludur'
  }),
  description: Joi.string().max(500).allow('').messages({
    'string.max': 'Açıklama en fazla 500 karakter olabilir'
  })
});

const validateCategory = (req, res, next) => {
  const { error } = categorySchema.validate(req.body, { abortEarly: false });
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
  validateCategory
}; 