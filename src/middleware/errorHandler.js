const winston = require('winston');
const path = require('path');

// Winston logger yapılandırması
const logger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        // Hata loglarını error.log dosyasına yaz
        new winston.transports.File({ 
            filename: path.join(__dirname, '../logs/error.log'),
            level: 'error'
        }),
        // Tüm logları combined.log dosyasına yaz
        new winston.transports.File({ 
            filename: path.join(__dirname, '../logs/combined.log')
        })
    ]
});

// Development ortamında konsola da log yaz
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

// Özel hata sınıfı
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Hata detaylarını logla
    logger.error({
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode,
        path: req.path,
        method: req.method,
        body: req.body,
        query: req.query,
        params: req.params,
        user: req.user ? req.user.id : 'unauthenticated'
    });

    // Development ortamında detaylı hata mesajı
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } 
    // Production ortamında sadece güvenli hata mesajı
    else {
        // Operational, güvenilir hatalar için
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        } 
        // Programlama veya bilinmeyen hatalar için
        else {
            // Log the error
            logger.error('UNEXPECTED ERROR 💥', err);
            
            // Genel hata mesajı
            res.status(500).json({
                status: 'error',
                message: 'Bir şeyler yanlış gitti!'
            });
        }
    }
};

// 404 handler
const notFoundHandler = (req, res, next) => {
    const err = new AppError(`${req.originalUrl} bulunamadı`, 404);
    next(err);
};

module.exports = {
    AppError,
    errorHandler,
    notFoundHandler,
    logger
}; 