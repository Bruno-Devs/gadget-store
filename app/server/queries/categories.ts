import { prisma } from "@/database";

export interface CategoryWithProducts {
  id: string;
  name: string;
  description: string | null;
  products: Array<{
    id: string;
    name: string;
    price: number;
    stock: number;
    imageUrl: string | null;
    isActive: boolean;
  }>;
}

/**
 * Get all categories
 */
export async function getAllCategories() {
  return await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });
}

/**
 * Get category by ID with products
 */
export async function getCategoryById(id: string): Promise<CategoryWithProducts | null> {
  return await prisma.category.findUnique({
    where: { id },
    include: {
      products: {
        where: {
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
          imageUrl: true,
          isActive: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });
}

/**
 * Get categories with product counts
 */
export async function getCategoriesWithProductCounts() {
  return await prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: {
            where: {
              isActive: true,
            },
          },
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
}

/**
 * Create a new category
 */
export async function createCategory(data: {
  name: string;
  description?: string;
}) {
  return await prisma.category.create({
    data: {
      name: data.name,
      description: data.description,
    },
  });
}

/**
 * Update a category
 */
export async function updateCategory(id: string, data: {
  name?: string;
  description?: string;
}) {
  return await prisma.category.update({
    where: { id },
    data,
  });
}

/**
 * Delete a category (only if it has no products)
 */
export async function deleteCategory(id: string) {
  // Check if category has products
  const categoryWithProducts = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  if (categoryWithProducts && categoryWithProducts._count.products > 0) {
    throw new Error('Cannot delete category with existing products');
  }

  return await prisma.category.delete({
    where: { id },
  });
} 