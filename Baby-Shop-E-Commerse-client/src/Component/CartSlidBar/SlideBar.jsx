import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCartItems, addToCart, removeCartItem } from "../../features/shopSlice"; // Import your Redux actions

const SlideBar = ({ isCartOpen, toggleCart }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const cartItems = useSelector((state) => state.shop.cartItems); // Select cart items from Redux state
  const currentUser = useSelector((state) => state.shop.currentUser); // Select current user from Redux state
  const userId = currentUser ? currentUser.id : null;

  useEffect(() => {
    if (isCartOpen && userId) {
      dispatch(getCartItems(userId)); // Fetch cart items when the cart opens
    }
  }, [isCartOpen, userId, dispatch]);

  const handleViewCart = () => {
    navigate("/cartitems");
    toggleCart();
  };

  const handleAddToCart = async (productId) => {
    try {
      await dispatch(addToCart({ userId, productId })); // Dispatch add to cart action
      dispatch(getCartItems(userId)); // Fetch updated cart items
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      await dispatch(removeCartItem({ userId, productId })); // Dispatch remove from cart action
      dispatch(getCartItems(userId)); // Fetch updated cart items
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isCartOpen ? "translate-x-0" : "translate-x-full"
      } lg:w-4/12 w-full max-w-[70%] z-50`}
    >
      <div className="flex flex-col h-full">
        <div className="p-6 flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Cart</h2>
            <FaTimes
              size={24}
              className="cursor-pointer"
              onClick={toggleCart}
            />
          </div>
          <hr className="border-gray-300 my-4" />
        </div>
        <div className="flex-1 overflow-y-auto px-6">
          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between mb-4"
              >
                {item.productId && (
                  <>
                    <img
                      src={item.productId.image}
                      alt={item.productId.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1 mx-4">
                      <p className="text-lg font-semibold">
                        {item.productId.name}
                      </p>
                      <div className="flex items-center mt-1">
                        <button
                          onClick={() =>
                            handleRemoveFromCart(item.productId._id)
                          }
                          className="text-gray-500 px-2 py-1 rounded-md border border-gray-300"
                        >
                          -
                        </button>
                        <p className="text-gray-600 mx-2">{item.quantity}</p>
                        <button
                          onClick={() => handleAddToCart(item.productId._id)}
                          className="text-gray-500 px-2 py-1 rounded-md border border-gray-300"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-gray-600">
                        ${(item.productId.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item.productId._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md"
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
        <div className="p-6 flex-shrink-0">
          <div>
            <hr className="border-gray-300" />
            <p className="text-lg mt-2">
              Subtotal: $
              {cartItems
                .reduce(
                  (total, item) =>
                    item.productId
                      ? total + item.productId.price * item.quantity
                      : total,
                  0
                )
                .toFixed(2)}
            </p>
            <button
              onClick={handleViewCart}
              className="w-full mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              View Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideBar;
