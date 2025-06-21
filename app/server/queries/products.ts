import { prisma } from "@/database";
import { Decimal } from "@prisma/client/runtime/library";

// Types for better type safety
export interface ProductWithRelations {
  id: string;
  name: string;
  description: string | null;
  price: Decimal;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  category: {
    id: string;
    name: string;
    description: string | null;
  };
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    userId: string;
    user: {
      id: string;
      name: string | null;
      email: string;
    };
  }>;
}

// Helper function to convert Decimal to number
export function decimalToNumber(decimal: Decimal): number {
  return Number(decimal);
}

/**
 * Get all active products with their categories and reviews
 */
export async function getAllProducts(): Promise<ProductWithRelations[]> {
  return await prisma.product.findMany({
    include: {
      category: true,
      reviews: {
        include: {
          user: true,
        },
      },
    },
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * Get a single product by ID with relations
 */
export async function getProductById(id: string): Promise<ProductWithRelations | null> {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: {
        include: {
          user: true,
        },
      },
    },
  });
}

/**
 * Get products by category
 */
export async function getProductsByCategory(categoryId: string): Promise<ProductWithRelations[]> {
  return await prisma.product.findMany({
    where: {
      categoryId,
      isActive: true,
    },
    include: {
      category: true,
      reviews: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * Search products by name or description
 */
export async function searchProducts(query: string): Promise<ProductWithRelations[]> {
  return await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: query,
            mode: 'insensitive',
          },
        },
      ],
    },
    include: {
      category: true,
      reviews: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * Get products with low stock (for inventory management)
 */
export async function getLowStockProducts(threshold: number = 10): Promise<ProductWithRelations[]> {
  return await prisma.product.findMany({
    where: {
      stock: {
        lte: threshold,
      },
      isActive: true,
    },
    include: {
      category: true,
      reviews: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      stock: 'asc',
    },
  });
}

/**
 * Create a new product
 */
export async function createProduct(data: {
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId: string;
}) {
  return await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      imageUrl: data.imageUrl,
      categoryId: data.categoryId,
    },
    include: {
      category: true,
    },
  });
}

/**
 * Update a product
 */
export async function updateProduct(id: string, data: {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
  categoryId?: string;
  isActive?: boolean;
}) {
  return await prisma.product.update({
    where: { id },
    data,
    include: {
      category: true,
    },
  });
}

/**
 * Delete a product (soft delete by setting isActive to false)
 */
export async function deleteProduct(id: string) {
  return await prisma.product.update({
    where: { id },
    data: { isActive: false },
  });
}

/**
 * Update product stock
 */
export async function updateProductStock(id: string, newStock: number) {
  return await prisma.product.update({
    where: { id },
    data: { stock: newStock },
  });
} 