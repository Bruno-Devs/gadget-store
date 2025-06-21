import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { formatCurrency } from "@/shared";
import { getAllProducts, type ProductWithRelations } from "../../server/queries/products";

export const meta: MetaFunction = () => [
  { title: "Products - Gadget Store" },
  { name: "description", content: "Browse our amazing gadgets" },
];

type LoaderData = {
  products: ProductWithRelations[];
  success: boolean;
  error: string | null;
};

// Loader function - runs on the server
export async function loader() {
  try {
    // Fetch products using the server query function
    const products = await getAllProducts();

    return json({ products, success: true, error: null });
  } catch (error) {
    console.error("Error loading products:", error);
    return json(
      { products: [], success: false, error: "Failed to load products" },
      { status: 500 }
    );
  }
}

export default function Products() {
  const { products, success, error } = useLoaderData<LoaderData>();

  if (!success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
              Error Loading Products
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
            Our Products
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Discover amazing gadgets for every need
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

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400">
              No products available
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-500">
              Check back later for new arrivals!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Product Image */}
                {product.imageUrl && (
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {product.description || "No description available"}
                  </p>

                  {/* Category */}
                  <div className="mb-3">
                    <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                      {product.category.name}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(Number(product.price))}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Stock: {product.stock}
                    </span>
                  </div>

                  {/* Reviews */}
                  {product.reviews.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                          {product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200">
                      Add to Cart
                    </button>
                    <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200">
                      ♡
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 