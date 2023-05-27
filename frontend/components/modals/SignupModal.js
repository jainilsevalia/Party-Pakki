import React, { useState } from "react";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithRedirect,
} from "firebase/auth";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FcGoogle, FcPhone } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import Popup from "reactjs-popup";

import { setPhoneModal, setSignupModal } from "../../actions/other";
import { client } from "../../axios-config";
import { auth } from "../../firebase";
import { capitalize } from "../../utils";
import Error from "../FormError";

const SignupModal = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const signupModal = useSelector((state) => state.other.signupModal);

  const dispatch = useDispatch();

  const [loader, setLoader] = useState(false);

  const clearForm = () => {
    reset({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreement: false,
    });
  };

  const onSubmit = async (data) => {
    setLoader(true);
    data.email = data.email.toLowerCase();
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const res = await client.post("account/signup/", data);
      if (res?.data?.success) {
        await sendEmailVerification(userCred.user);
        toast.success(res.data.success, { duration: 10000 });
        clearForm();
        setLoader(false);
        dispatch(setSignupModal(false));
      } else {
        setLoader(false);
        toast.error(res.data.error);
      }
    } catch (error) {
      setLoader(false);
      const err = String(error)
        .match(/(?<=auth\/).*\b/gm)[0]
        ?.replaceAll("-", " ");
      toast.error(err ? capitalize(err) : "Something went wrong");
    }
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };

  const openSignupWithPhoneModal = () => {
    dispatch(setSignupModal(false));
    dispatch(
      setPhoneModal({
        isOpen: true,
        title: "Sign up with phone number",
        subtitle: "Plan your party now! <span className='text-4xl'>🎉</span>",
      })
    );
  };

  return (
    <Popup
      open={signupModal}
      onClose={() => dispatch(setSignupModal(false))}
      closeOnDocumentClick
    >
      <div className="modal-open modal">
        <div className="modal-box relative">
          <h3 className="mb-4 text-center text-lg font-bold">Sign up</h3>
          <hr />
          <h2 className="mt-4 mb-6 text-2xl font-medium">
            Welcome to ParyPakki! <span className="text-4xl">🎉</span>
          </h2>
          <div>
            <button className="btn btn-outline w-full" onClick={googleSignIn}>
              <div className="flex w-full items-center justify-between">
                <FcGoogle size={27} />
                <div className="w-full">Sign up with Google</div>
              </div>
            </button>
            <button className="btn btn-accent mt-3 w-full">
              <div
                className="flex w-full items-center justify-between"
                onClick={openSignupWithPhoneModal}
              >
                <FcPhone size={27} transform="rotate(-90)" />
                <div className="w-full">Sign up with phone number</div>
              </div>
            </button>
            <div className="hr-with-words my-4">Or</div>
            <div className="flex gap-2">
              <div className="w-full">
                <input
                  type="text"
                  placeholder="First Name"
                  className="input input-bordered w-full"
                  {...register("first_name", {
                    required: "First name is required",
                    minLength: {
                      value: 3,
                      message: "First name must be at least 3 characters",
                    },
                  })}
                />
                <Error message={errors.first_name?.message} />
              </div>
              <div className="w-full">
                <input
                  type="text"
                  placeholder="Last Name"
                  className="input input-bordered w-full"
                  {...register("last_name", {
                    required: "Last name is required",
                    minLength: {
                      value: 3,
                      message: "Last name must be at least 3 characters",
                    },
                  })}
                />
                <Error message={errors.last_name?.message} />
              </div>
            </div>
            <input
              type="text"
              placeholder="Email"
              className="input input-bordered mt-3 w-full"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            <Error message={errors.email?.message} />
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered mt-3 w-full"
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value:
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                  message:
                    "Password must be at least 8 characters, contain at least 1 letter, 1 number and 1 special character",
                },
              })}
            />
            <Error message={errors.password?.message} />
            <input
              type="password"
              placeholder="Confirm Password"
              className="input input-bordered mt-3 w-full"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => {
                  if (value !== watch("password")) {
                    return "Password does not match";
                  } else {
                    return true;
                  }
                },
              })}
            />
            <Error message={errors.confirmPassword?.message} />
            <div className="mt-3">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox"
                  {...register("agreement", {
                    required: "Please tick terms & conditions checkbox",
                  })}
                />
                <span className="label-text">
                  I agree{" "}
                  <a href="#" className="text-sky-600 underline">
                    Terms & Condition
                  </a>
                </span>
              </label>
              <Error message={errors.agreement?.message} />
            </div>
            <button
              className="btn btn-primary mt-5 w-full"
              onClick={handleSubmit(onSubmit)}
            >
              {loader ? <div className="dot-flashing"></div> : "Sign up"}
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default SignupModal;
