import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface UserWithReviews {
  id: string;
  name: string;
  email: string;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    productId: string;
    product: {
      id: string;
      name: string;
      imageUrl: string | null;
    };
  }>;
}

/**
 * Get all users
 */
export async function getAllUsers() {
  return await prisma.user.findMany({
    orderBy: {
      name: 'asc',
    },
  });
}

/**
 * Get user by ID with reviews
 */
export async function getUserById(id: string): Promise<UserWithReviews | null> {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      reviews: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

/**
 * Create a new user
 */
export async function createUser(data: {
  name: string;
  email: string;
}) {
  return await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
    },
  });
}

/**
 * Update a user
 */
export async function updateUser(id: string, data: {
  name?: string;
  email?: string;
}) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

/**
 * Delete a user
 */
export async function deleteUser(id: string) {
  return await prisma.user.delete({
    where: { id },
  });
}

/**
 * Get users with review counts
 */
export async function getUsersWithReviewCounts() {
  return await prisma.user.findMany({
    include: {
      _count: {
        select: {
          reviews: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
} 