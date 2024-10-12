import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { addToWishlist, fetchProducts } from "../Redux/ShopSlice";
import CategoryProducts from "../Component/Category/Categories";
import Footer from "../Component/Footer/Footer";
import Spinner from "../Component/Spinner/Spinner";

const Shop = () => {
  const { category } = useParams();
  const dispatch = useDispatch();
  
  const { wishlistItems, products, status, error } = useSelector((state) => state.shop);
  const currentUser = useSelector((state) => state.shop.currentUser);
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      const filteredProducts =
        category && category !== "All"
          ? products.filter((product) => product.category === category)
          : products;

      setFetchedProducts(filteredProducts);
    }
  }, [products, category]);

  const isProductInWishlist = (productId) =>
    wishlistItems.some((item) => item._id === productId);

  const toggleWishlist = (productId) => {
    if (!currentUser) {
      alert("Please log in to manage your wishlist.");
      navigate("/login");
      return;
    }
    dispatch(addToWishlist({ userId: currentUser.id, productId }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-left mb-8">
          <h1 className="text-5xl text-gray-800 font-serif">Shop</h1>
          <hr className="m-10" />
        </div>
        <CategoryProducts />
        <div>
          <h1 className="mt-10 text-3xl font-serif text-gray-600 text-center">
            {category ? `${category}` : "All"}
          </h1>
          <hr className="m-8" />
        </div>
        {status === "loading" && <Spinner />}
        {error && <div>Error: {error}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {fetchedProducts.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-52 object-cover"
                onClick={() => navigate(`/shop/${item._id}`)}
              />
              <div className="p-4">
                <h4 className="text-lg font-serif font-semibold text-center mb-2 text-gray-900">
                  {item.name}
                </h4>

                <p className="text-gray-700 text-center font-serif mb-2">₹{item.price}</p>
                <p className="text-yellow-500 text-center">
                  {"★".repeat(item.stars)}
                  {"☆".repeat(5 - item.stars)}
                </p>
                <button
                  onClick={() => toggleWishlist(item._id)}
                  className="mt-2"
                >
                  <FontAwesomeIcon
                    icon={isProductInWishlist(item._id) ? solidHeart : regularHeart}
                    size="lg"
                    className={`${
                      isProductInWishlist(item._id) ? "text-red-500" : "text-gray-400"
                    } transition-colors duration-300`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <hr className="bg-gray mt-5" />
      <Footer />
    </div>
  );
};

export default Shop;
