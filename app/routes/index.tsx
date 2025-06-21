

export default function Index() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center">Welcome to Gadget Store</h1>
      <p className="text-lg text-center mb-10 text-gray-600">
        Your one-stop shop for the latest and greatest gadgets!
      </p>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Placeholder cards */}
          <div className="border rounded-lg p-4 shadow text-center">Product 1</div>
          <div className="border rounded-lg p-4 shadow text-center">Product 2</div>
          <div className="border rounded-lg p-4 shadow text-center">Product 3</div>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
        <div className="flex gap-4 justify-center">
          {/* Placeholder categories */}
          <span className="px-4 py-2 bg-gray-200 rounded">Phones</span>
          <span className="px-4 py-2 bg-gray-200 rounded">Laptops</span>
          <span className="px-4 py-2 bg-gray-200 rounded">Accessories</span>
        </div>
      </div>
    </div>
  );
} 