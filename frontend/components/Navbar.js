import React, { useEffect, useState } from "react";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { FiSearch } from "react-icons/fi";
import { MdPreview } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../actions/auth";
import { setLoginModal, setPhoneModal, setSignupModal } from "../actions/other";
import { path } from "../config";
import LoginModal from "./modals/LoginModal";
import SignupModal from "./modals/SignupModal";
import SignupWithPhoneModal from "./modals/SignupWithPhoneModal";

const Navbar = () => {
  const router = useRouter();
  const [searchString, setSearchString] = useState("");

  const [isPreviewOn, setIsPreviewOn] = useState(false);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const isPhoneSignupComplete = useSelector(
    (state) => state.auth.isPhoneSignupComplete
  );

  const dispatch = useDispatch();

  const logoutFn = () => {
    const res = dispatch(logout());
    if (res) {
      toast.success("Logged out successfully");
    } else {
      toast.error("Something went wrong");
    }
  };

  const disablePreview = async () => {
    setIsPreviewOn(false);
    const res = await axios.get(`/api/disable-preview`);
    if (res.status === 200) {
      router.reload(window.location.pathname);
    }
  };

  useEffect(() => {
    axios.get(`/api/is-in-preview`).then((res) => {
      if (res.status == 200) {
        setIsPreviewOn(res.data.isInPreviewMode);
      } else {
        setIsPreviewOn(false);
      }
    });
  }, []);

  return (
    <div
      className="sticky top-0 z-50 bg-base-100"
      style={{ boxShadow: "rgb(0 0 0 / 8%) 0 1px 12px" }}
    >
      <header className="custom-container px-3 sm:px-7">
        <nav className="navbar">
          <div className="navbar-start">
            <div
              className="mt-1 hidden cursor-pointer sm:block"
              onClick={() => router.push("/")}
            >
              <Image
                src="/assets/images/logo.svg"
                width={220}
                height={45}
                alt="logo"
              />
            </div>
            <div className="sm:hidden" onClick={() => router.push("/")}>
              <Image
                src="/assets/images/logo-mobile.svg"
                width={40}
                height={40}
                alt="logo"
              />
            </div>
          </div>
          <div className="navbar-end">
            <div className="mr-2 flex">
              <ul className="menu menu-horizontal mr-2 p-0">
                {isPreviewOn && (
                  <li
                    className="tooltip tooltip-bottom "
                    data-tip="Disable preview"
                  >
                    <a onClick={disablePreview}>
                      <MdPreview size={27} className="text-amber-500" />
                    </a>
                  </li>
                )}
                <li className="hidden sm:flex">
                  <Link href={"/blogs"}>Blog</Link>
                </li>
              </ul>
              <div className="form-control relative hidden sm:flex">
                <input
                  type="text"
                  placeholder="Search"
                  className="input input-bordered"
                  onChange={(e) => setSearchString(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      router.push(`/search?q=${searchString}`);
                    }
                  }}
                />
                <div className="absolute right-3 top-3.5 bg-white">
                  <FiSearch size={20} color={"grey"} />
                </div>
              </div>
            </div>
            {/* <a className="btn">Login</a> */}
            <div className="dropdown-end dropdown">
              <label tabIndex="0" className="avatar btn btn-ghost btn-circle">
                <div className="w-11">
                  <Image
                    src={
                      user?.photo
                        ? path(user.photo)
                        : "/assets/images/avatar.png"
                    }
                    layout="fill"
                    className="rounded-full"
                    alt="user avatar"
                  />
                </div>
              </label>
              <menu
                tabIndex="0"
                className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
              >
                {isAuthenticated ? (
                  <>
                    {isPhoneSignupComplete ? (
                      <>
                        <li onClick={() => router.push("/profile")}>
                          <div>Profile & Bookings</div>
                        </li>
                        <li onClick={() => router.push("/wishlist")}>
                          <div>Saved venues</div>
                        </li>
                      </>
                    ) : (
                      <>
                        <li
                          onClick={() =>
                            dispatch(setPhoneModal({ isOpen: true }))
                          }
                        >
                          <div>Complete sign-up process</div>
                        </li>
                      </>
                    )}

                    <li onClick={logoutFn}>
                      <div>Log out</div>
                    </li>
                  </>
                ) : (
                  <>
                    <li onClick={() => dispatch(setSignupModal(true))}>
                      <div>
                        <strong>Sign up</strong>
                      </div>
                    </li>
                    <li onClick={() => dispatch(setLoginModal(true))}>
                      <div>Login</div>
                    </li>
                  </>
                )}
              </menu>
            </div>
          </div>
        </nav>
      </header>
      {/* Login and signup modal  */}
      <SignupModal />
      <SignupWithPhoneModal />
      <LoginModal />
    </div>
  );
};

export default Navbar;
