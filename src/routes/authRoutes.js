const express = require("express");
const router = express.Router();
const { register, login, logout, refreshToken } = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");
const { validateRegister, validateLogin } = require("../validators/authValidator");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Kullanıcı adı
 *           minLength: 2
 *           maxLength: 50
 *         email:
 *           type: string
 *           format: email
 *           description: Email adresi
 *         password:
 *           type: string
 *           format: password
 *           description: Şifre
 *           minLength: 6
 *         confirmPassword:
 *           type: string
 *           format: password
 *           description: Şifre tekrarı
 *     LoginCredentials:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Kullanıcı adı
 *         email:
 *           type: string
 *           format: email
 *           description: Email adresi
 *         password:
 *           type: string
 *           format: password
 *           description: Şifre
 *     AuthResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         tokens:
 *           type: object
 *           properties:
 *             accessToken:
 *               type: string
 *               description: JWT access token
 *             refreshToken:
 *               type: string
 *               description: JWT refresh token
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Yeni kullanıcı kaydı
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Kullanıcı başarıyla oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Geçersiz istek veya kullanıcı zaten mevcut
 */
router.post("/register", validateRegister, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Kullanıcı girişi
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginCredentials'
 *     responses:
 *       200:
 *         description: Başarılı giriş
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Geçersiz kimlik bilgileri
 */
router.post("/login", validateLogin, login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Kullanıcı çıkışı
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Başarılı çıkış
 *       401:
 *         description: Yetkilendirme hatası
 */
router.post("/logout", authenticateToken, logout);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Access token yenileme
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token
 *     responses:
 *       200:
 *         description: Token başarıyla yenilendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Geçersiz veya süresi dolmuş refresh token
 */
router.post("/refresh-token", refreshToken);

module.exports = router;
