const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const { getUser, createUser, updateUser, deleteUser } = require("../controllers/userController");
const { validateUser } = require("../validators/userValidator");

/**
 * @swagger
 * components:
 *   schemas:
 *     UserUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Kullanıcı adı
 *           minLength: 2
 *           maxLength: 50
 *         email:
 *           type: string
 *           format: email
 *           description: Email adresi
 *         currentPassword:
 *           type: string
 *           format: password
 *           description: Mevcut şifre
 *         newPassword:
 *           type: string
 *           format: password
 *           description: Yeni şifre
 *           minLength: 6
 *         confirmNewPassword:
 *           type: string
 *           format: password
 *           description: Yeni şifre tekrarı
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Tüm kullanıcıları listele
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcılar başarıyla listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Yetkilendirme hatası
 */
router.get("/", authenticateToken, getUser);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Yeni kullanıcı oluştur (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Yetkilendirme hatası
 *       400:
 *         description: Geçersiz istek veya email zaten kullanımda
 */
router.post("/", authenticateToken, createUser);

/**
 * @swagger
 * /api/users:
 *   put:
 *     summary: Kullanıcı bilgilerini güncelle
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Yetkilendirme hatası
 *       400:
 *         description: Geçersiz istek
 */
router.put("/", authenticateToken, validateUser, updateUser);

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: Kullanıcı sil (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Kullanıcı ID
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       401:
 *         description: Yetkilendirme hatası
 *       404:
 *         description: Kullanıcı bulunamadı
 */
router.delete("/:userId", authenticateToken, deleteUser);

module.exports = router;

