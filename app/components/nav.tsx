import { Link } from "@remix-run/react";
import { Icon } from "./ui/icons";
import { PrimaryLogo } from "./ui/logo";
import MobileNav from "./mobile-nav";
import { useState } from "react";

// Mobile Search Component
const MobileSearch = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="md:hidden">
      {!isSearchOpen ? (
        <button
          onClick={() => setIsSearchOpen(true)}
          className="text-gray-700 hover:text-blue-600 p-1"
        >
          <Icon name="search" className="w-5 h-5" />
        </button>
      ) : (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-b shadow-lg z-50 animate-slide-down">
          <div className="p-4">
            <div className="relative">
              <Icon
                name="search"
                className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full border rounded pl-9 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Icon name="close" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Mobile Actions Component
const MobileActions = () => (
  <div className="flex items-center gap-3 md:hidden">
    <Link to="/cart" className="text-gray-700 hover:text-blue-600">
      <Icon name="cart" className="w-5 h-5" />
    </Link>
    <MobileSearch />
  </div>
);

// Logo Component
const Logo = () => (
  <div className=" flex justify-center md:justify-start items-center gap-4">
    <Link to="/" className="flex items-center">
      <PrimaryLogo width={160} height={80} />
    </Link>
    <SearchBar />
  </div>
);

// Desktop Navigation Component
const DesktopNav = () => (
  <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
    <Link to="/" className="hover:text-blue-600 flex items-center gap-2">
      Home
    </Link>
    <Link to="/categories" className="hover:text-blue-600">
      Categories
    </Link>
    <Link to="/products" className="hover:text-blue-600">
      Products
    </Link>
  </nav>
);

// Search Component
const SearchBar = () => (
  <div className="relative hidden md:block w-full max-w-md">
    <Icon
      name="search"
      className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
    />
    <input
      type="text"
      placeholder="Search products..."
      className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-white"
    />
  </div>
);

// Desktop Actions Component
const DesktopActions = () => (
  <div className="hidden md:flex items-center gap-3 md:gap-4">
    <Link to="/cart" className="text-gray-700 hover:text-blue-600">
      <Icon name="cart" className="w-5 h-5" />
    </Link>
    <Link
      to="/auth/login"
      className="text-blue-600 hover:underline flex items-center gap-2"
    >
      <Icon name="user" className="w-4 h-4" />
      <span className="hidden sm:inline">Log in</span>
    </Link>
    <Link
      to="/auth/register"
      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm hidden lg:block"
    >
      Sign up
    </Link>
  </div>
);

const Nav = () => {
  return (
    <header className="bg-white shadow-sm relative">
      <div className="w-full flex items-center justify-between py-4 px-4 md:container md:mx-auto md:px-6">
        <MobileActions />
        <Logo />
        <DesktopNav />
        {/* Right side - Hamburger menu (mobile) and full nav (desktop) */}
        <div className="flex items-center gap-3 md:gap-4">
          <DesktopActions />
          <div className="flex items-center gap-2 md:gap-4 rounded-full border border-gray-200 pl-4  md:hidden">
            <Link
              to="/auth/login"
              className="text-blue-600 hover:underline flex items-center gap-2"
            >
              <Icon name="user" className="w-4 h-4" />
            </Link>
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Nav;
