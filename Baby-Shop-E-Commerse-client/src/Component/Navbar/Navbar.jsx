import React, { useContext, useEffect, useState } from "react";
import {
  FaSearch,
  FaCartArrowDown,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/CartItem/ShopContext";
import SlideBar from "../CartSlidBar/SlideBar";
import Cookies from "js-cookie";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const navigate = useNavigate();
  const {
    search,
    setSearch,
    filteredProducts,
    currentUser,
    getCartItems,
    cartItems,
  } = useContext(ShopContext);

   const clearSearch = () => {
    setSearch('');
  }

  const isAdmin = Cookies.get("isAdmin");

  useEffect(() => {
    if (currentUser) {
      getCartItems(currentUser.id);
    }
  }, [currentUser]);

  const handleClick = () => {
    navigate(currentUser ? "/profile" : "/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <>
      {!isAdmin && (
        <div className="w-full bg-[#FFFFFF] text-gray-800 sticky top-0 z-10">
          <nav className="container mx-auto flex items-center justify-between py-4 ml-4">
            <div className="text-2xl font-bold ml-5">
              Little<span className="text-pink-500">Love</span>
            </div>

            <ul className="hidden lg:flex lg:flex-row lg:items-center lg:space-x-8">
              <li className="hover:text-pink-500 cursor-pointer">
                <Link to="/">Home</Link>
              </li>
              <li className="hover:text-pink-500 cursor-pointer">
                <Link to="/shop">Shop</Link>
              </li>
              <li className="hover:text-pink-500 cursor-pointer">
                <Link to="/about">About Us</Link>
              </li>
              <li className="hover:text-pink-500 cursor-pointer">
                <Link to="/testimonial">Testimonial</Link>
              </li>
              <li className="hover:text-pink-500 cursor-pointer">
                <Link to="/contact">Contact Us</Link>
              </li>
            </ul>

            <div className="flex items-center space-x-4 mr-5">
              <div className="relative">
                <input
                  type="text"
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border rounded-full text-black w-full sm:w-64"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
              {currentUser && (
                <div className="relative">
                  <FaCartArrowDown
                    onClick={toggleCart}
                    className="menu-cart hover:text-pink-500 cursor-pointer"
                  />

                  <span className="absolute -top-2.5 left-3/4 bg-red-500 text-white rounded-full text-xs px-1">
                    {cartItems.length}
                  </span>
                </div>
              )}
              <FaUser
                onClick={handleClick}
                className="menu-user hover:text-pink-500 cursor-pointer"
              />
              <button
                onClick={toggleMenu}
                aria-label="Toggle menu"
                className="lg:hidden"
              >
                {isMenuOpen ? (
                  <FaTimes className="menu-icon" />
                ) : (
                  <FaBars className="menu-icon" />
                )}
              </button>
            </div>
          </nav>

          {isMenuOpen && (
            <div className="lg:hidden w-full bg-green-50">
              <ul className="flex flex-col items-center space-y-4 py-4">
                <li className="hover:text-pink-500 cursor-pointer">
                  <Link to="/" onClick={toggleMenu}>
                    Home
                  </Link>
                </li>
                <li className="hover:text-pink-500 cursor-pointer">
                  <Link to="/shop" onClick={toggleMenu}>
                    Shop
                  </Link>
                </li>
                <li className="hover:text-pink-500 cursor-pointer">
                  <Link to="/about" onClick={toggleMenu}>
                    About Us
                  </Link>
                </li>
                <li className="hover:text-pink-500 cursor-pointer">
                  <Link to="/testimonial" onClick={toggleMenu}>
                    Testimonial
                  </Link>
                </li>
                <li className="hover:text-pink-500 cursor-pointer">
                  <Link to="/contact" onClick={toggleMenu}>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {search &&
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-md overflow-hidden shadow-md"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-60 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    <p className="text-gray-500">{product.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-900 font-bold">
                        ${product.price}
                      </span>
                      <button
                        onClick={() => {
                           clearSearch();
                           navigate(`/shop/${product._id}`);
                         }}
                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md focus:outline-none"
                      >
                       View Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <SlideBar isCartOpen={isCartOpen} toggleCart={toggleCart} />
        </div>
      )}
    </>
  );
};

export default Navbar;
