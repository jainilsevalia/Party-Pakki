import React, { useEffect } from "react";

import Cookies from "js-cookie";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "react-responsive";

import { isPhoneSignupComplete, loadUser } from "../actions/auth";
import { auth } from "../firebase";
import MobileFooter from "./MobileFooter";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const dispatch = useDispatch();

  const isPhoneScreen = useMediaQuery({
    query: "(max-width: 640px)",
  });

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user && (user.emailVerified || user.phoneNumber)) {
        const token = await user.getIdToken();
        Cookies.set("access", token);
        const user_db = await dispatch(loadUser());
        const phSignupComplete =
          user?.providerData[0]?.providerId === "phone"
            ? !!user_db?.email
            : true;
        dispatch(isPhoneSignupComplete(phSignupComplete));
      }
    });
  }, [dispatch]);

  return (
    <>
      <Navbar />
      {children}
      <div id="recaptcha-container"></div>
      {isPhoneScreen ? (
        <>
          <MobileFooter />
          <div>
            <Toaster position="top-center" containerStyle={{ top: "10px" }} />
          </div>
        </>
      ) : (
        <div>
          <Toaster position="bottom-right" />
        </div>
      )}
    </>
  );
};

export default Layout;
