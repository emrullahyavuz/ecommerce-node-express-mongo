const winston = require('winston');
const expressWinston = require('express-winston');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

// Logs dizinini oluştur
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Morgan stream oluştur
const accessLogStream = fs.createWriteStream(
    path.join(logDir, 'access.log'),
    { flags: 'a' }
);

// Morgan middleware'i
const morganMiddleware = morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
    { stream: accessLogStream }
);

// Winston request logger
const requestLogger = expressWinston.logger({
    transports: [
        new winston.transports.File({
            filename: path.join(logDir, 'requests.log'),
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ],
    meta: true, // Request metadata'sını logla
    msg: "HTTP {{req.method}} {{req.url}}", // Log mesajı formatı
    expressFormat: true, // Express formatını kullan
    colorize: false, // Dosyaya yazarken renklendirme yapma
    ignoreRoute: function (req, res) { 
        // Health check gibi bazı route'ları loglama
        return req.path === '/health';
    }
});

// Winston error logger
const errorLogger = expressWinston.errorLogger({
    transports: [
        new winston.transports.File({
            filename: path.join(logDir, 'errors.log'),
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ],
    meta: true,
    msg: "{{err.message}}",
    expressFormat: true,
    colorize: false
});

module.exports = {
    morganMiddleware,
    requestLogger,
    errorLogger
}; 