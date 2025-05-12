const express = require("express");
const router = express.Router();
const { createProduct, getProducts, getProductByCategory, updateProduct, deleteProduct } = require("../controllers/productController");
const { authenticateToken } = require("../middleware/auth");
const { validateProduct } = require("../validators/productValidator");

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - description
 *         - stock
 *         - category
 *       properties:
 *         _id:
 *           type: string
 *           description: Ürün ID
 *         name:
 *           type: string
 *           description: Ürün adı
 *           minLength: 2
 *           maxLength: 100
 *         price:
 *           type: number
 *           description: Ürün fiyatı
 *           minimum: 0
 *         description:
 *           type: string
 *           description: Ürün açıklaması
 *           maxLength: 1000
 *         stock:
 *           type: integer
 *           description: Stok miktarı
 *           minimum: 0
 *         category:
 *           type: string
 *           description: Kategori ID
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
 * /api/products:
 *   get:
 *     summary: Tüm ürünleri listele
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ürünler başarıyla listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: Yetkilendirme hatası
 */
router.get("/", authenticateToken, getProducts);

/**
 * @swagger
 * /api/products/category/{categoryId}:
 *   get:
 *     summary: Kategoriye göre ürünleri listele
 *     tags: [Products]
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
 *         description: Ürünler başarıyla listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: Yetkilendirme hatası
 *       404:
 *         description: Kategori bulunamadı
 */
router.get("/category/:categoryId", authenticateToken, getProductByCategory);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Yeni ürün oluştur
 *     tags: [Products]
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
 *               - price
 *               - description
 *               - stock
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               price:
 *                 type: number
 *                 minimum: 0
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ürün başarıyla oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Yetkilendirme hatası
 *       400:
 *         description: Geçersiz istek
 */
router.post("/", authenticateToken, validateProduct, createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Ürün güncelle
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ürün ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - description
 *               - stock
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               price:
 *                 type: number
 *                 minimum: 0
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ürün başarıyla güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Yetkilendirme hatası
 *       400:
 *         description: Geçersiz istek
 *       404:
 *         description: Ürün bulunamadı
 */
router.put("/:id", authenticateToken, validateProduct, updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Ürün sil
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ürün ID
 *     responses:
 *       200:
 *         description: Ürün başarıyla silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully
 *       401:
 *         description: Yetkilendirme hatası
 *       404:
 *         description: Ürün bulunamadı
 */
router.delete("/:id", authenticateToken, deleteProduct);

module.exports = router;

