import { client } from "../axios-config";
import {
  FEEDBACK_MODAL,
  LOAD_STATES_CITIES,
  LOGIN_MODAL,
  QA_MODAL,
  REQ_BOOKING_MODAL,
  SHARE_MODAL,
  SIGNUP_MODAL,
  SIGNUP_WITH_PHONE_MODAL,
} from "./types";

export const loadStatesCities = () => async (dispatch) => {
  try {
    const res = await client.get("states-cities/");
    if (res.status === 200) {
      dispatch({ type: LOAD_STATES_CITIES, payload: res.data });
    }
  } catch (error) {
    console.log(error);
  }
};

export const setLoginModal = (payload) => ({
  type: LOGIN_MODAL,
  payload,
});

export const setSignupModal = (payload) => ({
  type: SIGNUP_MODAL,
  payload,
});

export const setPhoneModal = (payload) => ({
  type: SIGNUP_WITH_PHONE_MODAL,
  payload,
});

export const setReqBookingModal = (payload) => ({
  type: REQ_BOOKING_MODAL,
  payload,
});

export const setQaModal = (payload) => ({
  type: QA_MODAL,
  payload,
});

export const setFeedbackModal = (payload) => ({
  type: FEEDBACK_MODAL,
  payload,
});

export const setShareModal = (payload) => ({
  type: SHARE_MODAL,
  payload,
});
