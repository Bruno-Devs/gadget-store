import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getAllCategories, getCategoriesWithProductCounts } from "@/server";

export const meta: MetaFunction = () => {
  return [
    { title: "Categories - Gadget Store" },
    { name: "description", content: "Browse products by category" },
  ];
};

export async function loader() {
  try {
    // Get categories with product counts
    const categories = await getCategoriesWithProductCounts();

    return json({ categories, success: true, error: null });
  } catch (error) {
    console.error("Error loading categories:", error);
    return json(
      { categories: [], success: false, error: "Failed to load categories" },
      { status: 500 }
    );
  }
}

export default function Categories() {
  const { categories, success, error } = useLoaderData<typeof loader>();

  if (!success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
              Error Loading Categories
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Product Categories
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Browse our products by category
          </p>
        </div>

        {/* Navigation */}
        <nav className="mb-6">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Home
          </Link>
        </nav>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400">
              No categories available
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-500">
              Categories will appear here once created.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {category.name}
                </h3>
                
                {category.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {category.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {category._count.products} product{category._count.products !== 1 ? 's' : ''}
                  </span>
                  
                  <Link
                    to={`/products?category=${category.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    View Products
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 