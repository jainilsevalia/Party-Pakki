import React, { useState } from "react";

import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FcGoogle, FcPhone } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import Popup from "reactjs-popup";

import { login } from "../../actions/auth";
import { setLoginModal, setPhoneModal } from "../../actions/other";
import { auth } from "../../firebase";
import Error from "../FormError";

const LoginModal = () => {
  const loginModal = useSelector((state) => state.other.loginModal);

  const dispatch = useDispatch();

  const [loader, setLoader] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const clearForm = () => {
    reset({
      email: "",
      password: "",
    });
  };

  const onSubmit = async (data) => {
    data.email = data.email.toLowerCase();
    setLoader(true);
    const res = await dispatch(login(data));
    if (res.status === 200) {
      clearForm();
      setLoader(false);
      toast.success(res.success);
      dispatch(setLoginModal(false));
    } else {
      toast.error(res.error);
    }
  };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };

  const openLoginWithPhoneModal = () => {
    dispatch(setLoginModal(false));
    dispatch(
      setPhoneModal({
        isOpen: true,
        title: "Login with phone number",
        subtitle: "Plan your party now! <span className='text-4xl'>🎉</span>",
      })
    );
  };

  return (
    <Popup
      open={loginModal}
      onClose={() => dispatch(setLoginModal(false))}
      closeOnDocumentClick
    >
      <div className="modal-open modal">
        <div className="modal-box relative">
          <h3 className="mb-4 text-center text-lg font-bold">Log in</h3>
          <hr />
          <h2 className="mt-4 mb-6 text-2xl font-medium">
            Plan your party now! <span className="text-4xl">🎉</span>
          </h2>
          <div>
            <button className="btn btn-outline w-full" onClick={googleLogin}>
              <div className="flex w-full items-center justify-between" z>
                <FcGoogle size={27} />
                <div className="w-full">Login with Google</div>
              </div>
            </button>
            <button
              className="btn btn-accent mt-3 w-full"
              onClick={openLoginWithPhoneModal}
            >
              <div className="flex w-full items-center justify-between">
                <FcPhone size={27} transform="rotate(-90)" />
                <div className="w-full">Login with phone number</div>
              </div>
            </button>
            <div className="hr-with-words my-4">Or</div>
            <input
              type="text"
              placeholder="Email"
              className="input input-bordered w-full"
              {...register("email", { required: "Email is required" })}
            />
            <Error message={errors.email?.message} />
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered mt-3 w-full"
              {...register("password", { required: "Password is required" })}
            />
            <Error message={errors.password?.message} />
            <button
              className="btn btn-primary mt-3 w-full"
              onClick={handleSubmit(onSubmit)}
            >
              {loader ? <div className="dot-flashing"></div> : "Login"}
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default LoginModal;
