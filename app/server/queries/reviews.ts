import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ReviewWithRelations {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  productId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  product: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
}

/**
 * Get all reviews with user and product info
 */
export async function getAllReviews(): Promise<ReviewWithRelations[]> {
  return await prisma.review.findMany({
    include: {
      user: true,
      product: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * Get review by ID with relations
 */
export async function getReviewById(id: string): Promise<ReviewWithRelations | null> {
  return await prisma.review.findUnique({
    where: { id },
    include: {
      user: true,
      product: true,
    },
  });
}

/**
 * Get reviews for a specific product
 */
export async function getReviewsByProduct(productId: string): Promise<ReviewWithRelations[]> {
  return await prisma.review.findMany({
    where: { productId },
    include: {
      user: true,
      product: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * Get reviews by a specific user
 */
export async function getReviewsByUser(userId: string): Promise<ReviewWithRelations[]> {
  return await prisma.review.findMany({
    where: { userId },
    include: {
      user: true,
      product: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * Get average rating for a product
 */
export async function getProductAverageRating(productId: string) {
  const result = await prisma.review.aggregate({
    where: { productId },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  return {
    averageRating: result._avg.rating || 0,
    totalReviews: result._count.rating,
  };
}

/**
 * Create a new review
 */
export async function createReview(data: {
  rating: number;
  comment?: string;
  userId: string;
  productId: string;
}) {
  return await prisma.review.create({
    data: {
      rating: data.rating,
      comment: data.comment,
      userId: data.userId,
      productId: data.productId,
    },
    include: {
      user: true,
      product: true,
    },
  });
}

/**
 * Update a review
 */
export async function updateReview(id: string, data: {
  rating?: number;
  comment?: string;
}) {
  return await prisma.review.update({
    where: { id },
    data,
    include: {
      user: true,
      product: true,
    },
  });
}

/**
 * Delete a review
 */
export async function deleteReview(id: string) {
  return await prisma.review.delete({
    where: { id },
  });
}

/**
 * Get recent reviews (for dashboard)
 */
export async function getRecentReviews(limit: number = 10): Promise<ReviewWithRelations[]> {
  return await prisma.review.findMany({
    take: limit,
    include: {
      user: true,
      product: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * Get top rated products
 */
export async function getTopRatedProducts(limit: number = 10) {
  return await prisma.product.findMany({
    where: {
      isActive: true,
      reviews: {
        some: {},
      },
    },
    include: {
      category: true,
      reviews: {
        include: {
          user: true,
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
    orderBy: [
      {
        reviews: {
          _avg: {
            rating: 'desc',
          },
        },
      },
      {
        _count: {
          reviews: 'desc',
        },
      },
    ],
    take: limit,
  });
} 