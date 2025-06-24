import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../../shared';

const router = express.Router();

// PrismaClient singleton pattern
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// GET /api/products - Get all products
router.get('/', async (req, res, next) => {
  try {
    const { page = '1', limit = '10', category, search } = req.query;
    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.max(Number(limit) || 10, 1);
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(category && { categoryId: String(category) }),
      ...(search && {
        OR: [
          { name: { contains: String(search), mode: Prisma.QueryMode.insensitive } },
          { description: { contains: String(search), mode: Prisma.QueryMode.insensitive } },
        ],
      }),
    };

    // Get products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          reviews: true,
          _count: true,
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error(error);
    next(new AppError('Failed to fetch products', 500));
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: true,
        _count: true,
      },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Failed to fetch product', 500));
    }
  }
});

// POST /api/products - Create new product (Admin only)
router.post('/', async (req, res, next) => {
  try {
    const { name, description, price, stock, categoryId, imageUrl, condition } = req.body;

    // Validate required fields
    if (!name || !price || !categoryId || !condition) {
      throw new AppError('Name, price, category, and condition are required', 400);
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: stock !== undefined ? Number(stock) : 0,
        categoryId,
        imageUrl,
        isActive: true,
        condition,
      } as Prisma.ProductUncheckedCreateInput,
      include: {
        category: true,
        reviews: true,
        _count: true,
      },
    });

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully',
    });
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Failed to create product', 500));
    }
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, categoryId, imageUrl, isActive} = req.body;

    // Build update data object only with provided fields
    const data: Prisma.ProductUncheckedUpdateInput = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = Number(price);
    if (stock !== undefined) data.stock = Number(stock);
    if (categoryId !== undefined) data.categoryId = categoryId;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (isActive !== undefined) data.isActive = isActive;

    const product = await prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        reviews: true,
        _count: true,
      },
    });

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully',
    });
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      next(error);
    } else if (
      error instanceof Error &&
      error.message.includes('Record to update not found')
    ) {
      next(new AppError('Product not found', 404));
    } else {
      next(new AppError('Failed to update product', 500));
    }
  }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error(error);
    if (
      error instanceof Error &&
      error.message.includes('Record to delete does not exist')
    ) {
      next(new AppError('Product not found', 404));
    } else {
      next(new AppError('Failed to delete product', 500));
    }
  }
});

export default router; 