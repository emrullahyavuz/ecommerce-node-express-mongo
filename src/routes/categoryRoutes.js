const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryBySlug,
} = require("../controllers/categoryController");
const { authenticateToken } = require("../middleware/auth");
const { validateCategory } = require("../validators/categoryValidator");

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: Kategori ID
 *         name:
 *           type: string
 *           description: Kategori adı
 *           minLength: 2
 *           maxLength: 50
 *         description:
 *           type: string
 *           description: Kategori açıklaması
 *           maxLength: 500
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Oluşturulma tarihi
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Güncellenme tarihi
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Tüm kategorileri listele
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Kategoriler başarıyla listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get("/", getCategories);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Yeni kategori oluştur
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               description:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       201:
 *         description: Kategori başarıyla oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401:
 *         description: Yetkilendirme hatası
 *       400:
 *         description: Geçersiz istek
 */
router.post("/", authenticateToken, validateCategory, createCategory);

/**
 * @swagger
 * /api/categories/{categoryId}:
 *   put:
 *     summary: Kategori güncelle
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Kategori ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               description:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Kategori başarıyla güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401:
 *         description: Yetkilendirme hatası
 *       400:
 *         description: Geçersiz istek
 *       404:
 *         description: Kategori bulunamadı
 */
router.put("/:categoryId", authenticateToken, validateCategory, updateCategory);

/**
 * @swagger
 * /api/categories/{categoryId}:
 *   delete:
 *     summary: Kategori sil
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Kategori ID
 *     responses:
 *       200:
 *         description: Kategori başarıyla silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category deleted successfully
 *       401:
 *         description: Yetkilendirme hatası
 *       404:
 *         description: Kategori bulunamadı
 */
router.delete("/:categoryId", authenticateToken, deleteCategory);

/**
 * @swagger
 * /api/categories/slug/{slug}:
 *   get:
 *     summary: Slug'a göre kategori getir
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Kategori slug'ı
 *     responses:
 *       200:
 *         description: Kategori başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Kategori bulunamadı
 */
router.get("/slug/:slug", getCategoryBySlug);

module.exports = router;
