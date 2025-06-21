import { useState } from "react";
import { Icon } from "./ui/icons";
import { Link } from "@remix-run/react";

const MobileNav = () => {
    const [menuOpen, setMenuOpen] = useState(false)
  return (
    <>
    <button
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            <Icon name={menuOpen ? "close" : "menu"} className="w-6 h-6 text-gray-700" />
          </button>
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-b shadow-lg z-50 animate-slide-down">
          <nav className="flex flex-col gap-2 p-4 text-gray-700 font-medium">
            <Link
              to="/"
              className="py-3 px-3 rounded hover:bg-blue-50 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/categories"
              className="py-3 px-3 rounded hover:bg-blue-50 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              to="/products"
              className="py-3 px-3 rounded hover:bg-blue-50 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Products
            </Link>
            <div className="flex gap-3 mt-4 pt-4 border-t">
              <Link
                to="/auth/login"
                className="flex-1 text-blue-600 hover:underline py-3 px-3 rounded flex items-center gap-2 justify-center hover:bg-blue-50 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <Icon name="user" className="w-4 h-4" /> Log in
              </Link>
              <Link
                to="/auth/register"
                className="flex-1 bg-blue-600 text-white px-3 py-3 rounded hover:bg-blue-700 text-center transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default MobileNav;
