import express from 'express';
import { prisma } from '../../database';
import { AppError } from '../../shared';

const router = express.Router();

// GET /api/products - Get all products
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    // Build where clause
    const where: any = { isActive: true };
    
    if (category) {
      where.category = { name: { contains: String(category), mode: 'insensitive' } };
    }
    
    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    // Get products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          reviews: {
            include: {
              user: {
                select: { name: true, email: true }
              }
            }
          },
          _count: {
            select: { reviews: true }
          }
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages
      }
    });
  } catch (error) {
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
        reviews: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { reviews: true }
        }
      }
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
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
    const { name, description, price, stock, categoryId, imageUrl } = req.body;

    // Validate required fields
    if (!name || !price || !categoryId) {
      throw new AppError('Name, price, and category are required', 400);
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock) || 0,
        categoryId,
        imageUrl
      },
      include: {
        category: true
      }
    });

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
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
    const { name, description, price, stock, categoryId, imageUrl, isActive } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: price ? Number(price) : undefined,
        stock: stock ? Number(stock) : undefined,
        categoryId,
        imageUrl,
        isActive
      },
      include: {
        category: true
      }
    });

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
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
      where: { id }
    });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(new AppError('Failed to delete product', 500));
  }
});

export default router; 