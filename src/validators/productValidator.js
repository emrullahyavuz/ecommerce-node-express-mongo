const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Ürün adı boş bırakılamaz',
    'string.min': 'Ürün adı en az 2 karakter olmalıdır',
    'string.max': 'Ürün adı en fazla 100 karakter olabilir',
    'any.required': 'Ürün adı zorunludur'
  }),
  description: Joi.string().max(1000).required().messages({
    'string.empty': 'Ürün açıklaması boş bırakılamaz',
    'string.max': 'Ürün açıklaması en fazla 1000 karakter olabilir',
    'any.required': 'Ürün açıklaması zorunludur'
  }),
  price: Joi.number().min(0).required().messages({
    'number.base': 'Fiyat sayısal bir değer olmalıdır',
    'number.min': 'Fiyat 0\'dan küçük olamaz',
    'any.required': 'Fiyat zorunludur'
  }),
  stock: Joi.number().integer().min(0).required().messages({
    'number.base': 'Stok sayısal bir değer olmalıdır',
    'number.integer': 'Stok tam sayı olmalıdır',
    'number.min': 'Stok 0\'dan küçük olamaz',
    'any.required': 'Stok zorunludur'
  }),
  category: Joi.string().required().messages({
    'string.empty': 'Kategori seçimi zorunludur',
    'any.required': 'Kategori seçimi zorunludur'
  })
});

const validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body, { abortEarly: false });
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
  validateProduct
}; 