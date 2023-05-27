import { signInWithEmailAndPassword } from "firebase/auth";
import Cookies from "js-cookie";

import { auth_client, client } from "../axios-config";
import { auth } from "../firebase";
import {
  LOAD_USER_SUCCESS,
  LOAD_USER_FAILURE,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  IS_PHONE_SIGNUP_COMPLETE,
} from "./types";

export const signupWithPhone = (obj) => async (dispatch) => {
  try {
    const res = await client.post("account/signup-with-phone/", obj);
    if (res.status === 200) {
      dispatch(loadUser());
      dispatch({
        type: IS_PHONE_SIGNUP_COMPLETE,
        payload: true,
      });
      return { status: 200, success: res.data.success };
    } else {
      return { status: res.status, error: "Something went wrong" };
    }
  } catch (error) {
    return { status: 500, error: "Something went wrong" };
  }
};

export const login = (obj) => async (dispatch) => {
  try {
    const userCred = await signInWithEmailAndPassword(
      auth,
      obj.email,
      obj.password
    );
    const user = userCred?.user;
    if (user) {
      if (user.emailVerified) {
        const token = await user.getIdToken();
        Cookies.set("access", token);
        return {
          status: 200,
          success: "Login successfully",
        };
      } else {
        dispatch({
          type: LOAD_USER_FAILURE,
        });
        return {
          status: 401,
          error: "Please verify your email",
        };
      }
    } else {
      dispatch({
        type: LOAD_USER_FAILURE,
      });
      return {
        status: 401,
        error: "Login failed",
      };
    }
  } catch (error) {
    dispatch({
      type: LOAD_USER_FAILURE,
    });
    return {
      status: 500,
      error:
        "Something went wrong. Make sure you entered the correct credentials",
    };
  }
};

export const loadUser = () => async (dispatch) => {
  const access = Cookies.get("access") ?? false;

  if (access === false) {
    dispatch({ type: LOAD_USER_FAILURE });
    return {
      status: 401,
      error: "Unauthorized",
    };
  }

  try {
    const res = await auth_client.get("user/");
    if (res.status === 200) {
      dispatch({ type: LOAD_USER_SUCCESS, payload: res.data.user });
      return res.data.user;
    } else {
      return {
        status: res.status,
        error: res.data.error,
      };
    }
  } catch (error) {
    return {
      status: 500,
      error: "Something went wrong",
    };
  }
};

export const logout = () => async (dispatch) => {
  try {
    Cookies.remove("access");
    await auth.signOut();

    dispatch({ type: LOGOUT_SUCCESS });

    return {
      status: 200,
      success: "Logout successfully",
    };
  } catch (error) {
    dispatch({ type: LOGOUT_FAILURE });
    return {
      status: 500,
      error: "Something went wrong",
    };
  }
};

export const hasToken = () => {
  if (Cookies.get("access")) {
    return true;
  } else {
    return false;
  }
};

export const userWithPhoneNumberExist = (data) => async (dispatch) => {
  try {
    const res = await client.post("account/exists/", DataTransferItemList);
    if (res.status === 200) {
      return {
        status: 200,
        success: res.data.success,
      };
    }
  } catch {
    return {
      status: 500,
      error: "Something went wrong",
    };
  }
};

export const updateUser = (obj) => async (dispatch) => {
  const access = Cookies.get("access") ?? false;

  if (access === false) {
    return {
      status: 401,
      error: "Unauthorized",
    };
  }

  try {
    const res = await auth_client.put("update-user/", obj, {
      headers: {
        "Content-Type": "Multipart/form-data",
      },
    });
    if (res.status === 200) {
      dispatch({
        type: LOAD_USER_SUCCESS,
        payload: res.data.user,
      });
      return { status: 200, success: "Profile updated successfully" };
    } else {
      return { status: res.status, error: res.data.error };
    }
  } catch (error) {
    return { status: 500, error: "Something went wrong" };
  }
};

export const saveVenueToWishlist = (uuid) => async (dispatch) => {
  try {
    const res = await auth_client.post("wishlist/", { uuid });
    if (res.status === 201) {
      dispatch(loadUser());
      return { status: 201, success: "Venue saved to wishlist" };
    } else {
      return { status: res.status, error: res.data.error };
    }
  } catch (error) {
    return { status: 500, error: "Something went wrong" };
  }
};

export const removeVenueFromWishlist = (uuid) => async (dispatch) => {
  try {
    const res = await auth_client.delete(`wishlist/${uuid}/`);
    if (res.status === 200) {
      dispatch(loadUser());
      return { status: 200, success: "Venue removed from wishlist" };
    } else {
      return { status: res.status, error: res.data.error };
    }
  } catch (error) {
    return { status: 500, error: "Something went wrong" };
  }
};

export const isPhoneSignupComplete = (payload) => {
  return {
    type: IS_PHONE_SIGNUP_COMPLETE,
    payload,
  };
};

export const addReview =
  ({ venueId, rating, comment }) =>
  async (dispatch) => {
    try {
      const res = await auth_client.post(`user/review/${venueId}/`, {
        rating,
        comment,
      });
      if (res.status === 200) {
        dispatch(loadUser());
        return { status: 200, success: res.data.success };
      } else {
        return { status: res.status, error: res.data.error };
      }
    } catch (error) {
      return { status: 500, error: "Something went wrong" };
    }
  };
