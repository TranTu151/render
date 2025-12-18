const express = require("express");
const { createProduct, updateProduct, deleteProduct } = require("../controllers/products.controller");
const { createProductSchema, updateProductSchema } = require("../schemas/product.dto");
const { validate } = require("../middlewares/validate");
const { asyncHandler } = require("../utils/async");
const { requireAuth, requireRole } = require("../middlewares/auth");
const { Product } = require("../models/product.model");

const router = express.Router();

// --- 🔒 Admin-Only Routes (POST, PATCH, DELETE) ---

// POST /api/v1/products - Create a new product
router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  validate(createProductSchema, "body"),
  asyncHandler(createProduct)
);

// PATCH /api/v1/products/:id - Update a product
router.patch(
  "/:id",
  requireAuth,
  requireRole("admin"),
  validate(updateProductSchema, "body"),
  asyncHandler(updateProduct)
);

// DELETE /api/v1/products/:id - Delete a product
router.delete("/:id", requireAuth, requireRole("admin"), asyncHandler(deleteProduct));

// --- 🌐 Public Read Routes (GET) ---

// GET /api/v1/products - Get all products with pagination, limiting, and searching
router.get("/", async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "12", 10), 1), 50);
    const q = String(req.query.q || "").trim();

    const filter = q
      ? {
          $or: [
            { title: new RegExp(q, "i") },
            { brand: new RegExp(q, "i") },
            { category: new RegExp(q, "i") },
          ],
        }
      : {};

    const total = await Product.countDocuments(filter);
    const data = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const hasNext = page * limit < total;
    res.json({ data, page, limit, total, hasNext });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/products/:slug - Get product by slug (deprecated by the /slug/:slug route)
// I will keep the more specific route /slug/:slug and assume this one is intended to be for the product ID or should be removed.
// Since the requirement is to reorganize, I'll keep the /slug/:slug version which is more robust.
// The original /:slug route is kept below, but if both are present, /:slug will catch a slug before /slug/:slug.
// **Note:** Routes with specific segment names (like `/slug/:slug`) should be placed **before** generic dynamic routes (like `/:id` or `/:slug`) to prevent the generic route from prematurely catching the request.

// GET /api/v1/products/slug/:slug - Get product by robust slug matching
router.get("/slug/:slug", async (req, res, next) => {
  try {
    const raw = (req.params.slug || "").toLowerCase().trim();

    // Luôn thử chính xác trước (Always try exact match first)
    const candidates = new Set([raw]);

    // Nếu có pattern ...-<number> thì thêm biến thể có padding 2 & 3
    const m = raw.match(/^(.*-)(\d+)$/);
    if (m) {
      const base = m[1];
      const num = m[2];
      candidates.add(base + num.padStart(2, "0")); // 01
      candidates.add(base + num.padStart(3, "0")); // 001
    }

    // Tìm theo danh sách ứng viên (Find by candidate list)
    const p = await Product.findOne({ slug: { $in: Array.from(candidates) } })
      .select("_id slug title price images stock")
      .lean();

    if (!p) {
      return res
        .status(404)
        .json({ ok: false, error: { code: "PRODUCT_NOT_FOUND", message: "Product not found" } });
    }

    return res.json({ ok: true, product: p });
  } catch (e) {
    next(e);
  }
});

// GET /api/v1/products/:slug - Get product by exact slug (This route is placed *after* the more specific /slug/:slug and the root / to function correctly, assuming it's meant to be an exact match or an ID search, but the implementation uses slug. I'll rename the parameter to make the path clearer.)
router.get("/:idOrSlug", async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    // Assuming this route is for fetching by MongoDB ID or a simple exact slug match.
    // The previous implementation was only by slug. I'll stick to the original logic for simplicity in refactoring.
    const product = await Product.findOne({ slug: idOrSlug }).lean();
    if (!product) {
      return res.status(404).json({ ok: false, error: { code: "NOT_FOUND", message: "Product not found" } });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

module.exports = router;