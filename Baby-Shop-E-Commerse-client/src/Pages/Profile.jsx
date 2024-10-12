import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectShop } from "../Redux/ShopSlice";
import { FaHeart, FaInfoCircle } from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector(selectShop);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [navigate, currentUser]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <main className="profile-page">
        <section className="relative block" style={{ height: "400px" }}>
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80')",
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-50 bg-black"
            ></span>
          </div>
        </section>
        <section className="relative px-4 py-8 bg-gray-100 lg:px-8">
          <div className="container mx-auto">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-40 lg:-mt-64">
              <div className="px-6">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center"></div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                    <div className="py-6 px-3 mt-10 sm:mt-0 flex justify-center lg:justify-end">
                      <button
                        onClick={handleLogout}
                        className="bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1"
                        style={{ transition: "all .15s ease" }}
                      >
                        Logout
                      </button>
                      <button
                        onClick={handleGoHome}
                        className="bg-gray-600 active:bg-gray-700 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1"
                        style={{ transition: "all .15s ease" }}
                      >
                        Go Home
                      </button>
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-1 mt-10 lg:mt-0">
                    <div className="flex justify-center py-4 lg:pt-4 pt-8">
                      <div className="mr-4 p-3 text-center">
                        <span className="text-lg font-bold block uppercase tracking-wide text-gray-700">
                          Username
                        </span>
                        <span className="text-sm text-gray-500">
                          {currentUser.username}
                        </span>
                      </div>
                      <div className="mr-4 p-3 text-center">
                        <span className="text-lg font-bold block uppercase tracking-wide text-gray-700">
                          Email
                        </span>
                        <span className="text-sm text-gray-500">
                          {currentUser.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-10 py-10 border-t border-gray-300 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 px-4">
                      <p className="mb-4 text-base leading-relaxed text-gray-800">
                        This is the profile of {currentUser.username}. Feel free
                        to explore more details by clicking on the links below.
                      </p>
                      <div className="flex flex-col items-center space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                        <Link to={"/orderDetails"}>
                          <button
                            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            title="Order Details"
                          >
                            <FaInfoCircle className="mr-2" />
                            Order Details
                          </button>
                        </Link>
                        <Link to={"/wishlist"}>
                          <button
                            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                            title="Add to Wishlist"
                          >
                            <FaHeart className="mr-2" />
                            Wishlist
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Profile;
