import React, { useEffect, useState } from "react";

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import parse from "html-react-parser";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import { useDispatch, useSelector } from "react-redux";
import VerificationInput from "react-verification-input";
import Popup from "reactjs-popup";
import "react-phone-input-2/lib/bootstrap.css";

import { signupWithPhone } from "../../actions/auth";
import { setPhoneModal } from "../../actions/other";
import { auth } from "../../firebase";
import Error from "../FormError";

const SignupWithPhoneModal = () => {
  const [phone, setPhone] = useState();
  const [OTP, setOTP] = useState("");
  const [isOTPGenerated, setIsOTPGenerated] = useState(false);
  const [isOTPSuccess, setIsOTPSuccess] = useState(false);

  const [sendOTPLoader, setSendOTPLoader] = useState(false);
  const [verifyOTPLoader, setVerifyOTPLoader] = useState(false);
  const [signupLoader, setSignupLoader] = useState(false);

  const isPhoneSignupComplete = useSelector(
    (state) => state.auth.isPhoneSignupComplete
  );

  const phoneModal = useSelector((state) => state.other.phoneModal);

  const dispatch = useDispatch();

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
      },
      auth
    );
  };

  const requestOTP = async () => {
    setSendOTPLoader(true);
    if (!window.recaptchaVerifier) {
      generateRecaptcha();
    }
    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
      );
      window.confirmationResult = confirmationResult;
      setIsOTPGenerated(true);
      setSendOTPLoader(false);
    } catch (error) {
      toast.error(
        "Something went wrong.Please ensure you have entered a valid phone number"
      );
      setSendOTPLoader(false);
    }
  };

  const verifyOTP = async () => {
    setVerifyOTPLoader(true);
    if (OTP.length === 6) {
      const result = await window.confirmationResult.confirm(OTP);
      if (result.user) {
        const token = await result.user.getIdToken();
        Cookies.set("access", token);
        toast.success("OTP verified successfully");
        setIsOTPSuccess(true);
        setVerifyOTPLoader(false);
      }
    } else {
      toast.error("Please enter valid OTP");
      setVerifyOTPLoader(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const clearAndCloseForm = () => {
    reset({
      first_name: "",
      last_name: "",
      email: "",
    });
    setPhone("");
    setOTP("");
    setIsOTPGenerated(false);
    setIsOTPSuccess(false);
    dispatch(
      setPhoneModal({
        isOpen: false,
      })
    );
  };

  const signup = async (obj) => {
    setSignupLoader(true);
    obj.phone_number = phone || auth?.currentUser?.phoneNumber;
    obj.email = obj.email.toLowercase();
    const res = await dispatch(signupWithPhone(obj));
    if (res.status === 200) {
      setSignupLoader(false);
      clearAndCloseForm();
      toast.success(res.success);
    } else {
      setSignupLoader(false);
      toast.error(res.error);
    }
  };

  useEffect(() => {
    if (
      phoneModal.openFrom !== "profile" &&
      isPhoneSignupComplete &&
      isOTPGenerated &&
      isOTPSuccess
    ) {
      clearAndCloseForm();
      toast.success("You are now logged in");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isPhoneSignupComplete,
    isOTPGenerated,
    isOTPSuccess,
    phoneModal.openFrom,
  ]);

  return (
    <Popup
      open={phoneModal.isOpen}
      onClose={() =>
        dispatch(
          setPhoneModal({
            isOpen: false,
          })
        )
      }
      closeOnDocumentClick
    >
      <div className="modal-open modal">
        <div className="modal-box relative" style={{ overflow: "initial" }}>
          <h3 className="mb-4 text-center text-lg font-bold">
            {phoneModal.title ? phoneModal.title : ""}
          </h3>
          <hr />
          <h2 className="mt-4 mb-6 text-2xl font-medium">
            {phoneModal.subtitle ? parse(phoneModal.subtitle) : ""}
          </h2>
          <div>
            {(phoneModal.openFrom === "profile" || !isPhoneSignupComplete) &&
              !isOTPGenerated && (
                <>
                  <label className="label">Phone number</label>
                  <div className="flex gap-2">
                    <PhoneInput
                      country={"in"}
                      value={"+" + phone}
                      onChange={(phone) => setPhone("+" + phone)}
                      inputClass="input mt-1"
                      inputStyle={{ width: "100%", borderRadius: "0px" }}
                      enableSearch
                      searchStyle={{ width: "93%", padding: "10px" }}
                      searchPlaceholder="Search"
                      countryCodeEditable={false}
                      dropdownStyle={{ zIndex: "999" }}
                      dropdownClass="open-upwards-mobile"
                    />

                    <button
                      className="btn btn-primary mt-1"
                      onClick={requestOTP}
                    >
                      {sendOTPLoader ? (
                        <div className="dot-flashing"></div>
                      ) : (
                        "Send OTP"
                      )}
                    </button>
                  </div>
                </>
              )}
            {isOTPGenerated && !isOTPSuccess && (
              <>
                <div className="label">One Time Password (OTP)</div>
                <VerificationInput
                  value={OTP}
                  onChange={(OTP) => setOTP(OTP)}
                  autoFocus
                  removeDefaultStyles
                  classNames={{
                    container: "w-full gap-3",
                    character: "input input-bordered text-2xl p-2",
                    characterInactive: "border-2 bg-slate-200",
                    characterSelected: "border-2 border-sky-400",
                  }}
                />
                <button
                  className="btn btn-primary float-right mt-5"
                  onClick={verifyOTP}
                >
                  {verifyOTPLoader ? (
                    <div className="dot-flashing"></div>
                  ) : (
                    "Verify"
                  )}
                </button>
              </>
            )}
            {isPhoneSignupComplete === false && isOTPGenerated && isOTPSuccess && (
              <>
                <div className="mb-3">
                  Please fill up following details to complete sign-up process.
                </div>
                {phoneModal.openFrom !== "profile" && (
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
                )}
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
                <div className="label-text-alt mt-2">
                  An email address is required so that updates about your
                  bookings or inquiries can be sent to you. We ensure that you
                  won&apos;t receive unsolicited emails from us.
                </div>
                <button
                  className="btn btn-primary mt-5 w-full"
                  onClick={handleSubmit(signup)}
                >
                  {signupLoader ? (
                    <div className="dot-flashing"></div>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default SignupWithPhoneModal;
