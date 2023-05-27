import {
  FEEDBACK_MODAL,
  LOAD_STATES_CITIES,
  LOGIN_MODAL,
  QA_MODAL,
  REQ_BOOKING_MODAL,
  SHARE_MODAL,
  SIGNUP_MODAL,
  SIGNUP_WITH_PHONE_MODAL,
} from "../actions/types";

const initialState = {
  locations: {},
  loginModal: false,
  signupModal: false,
  phoneModal: {
    isOpen: false,
    title: "",
    subtitle: "",
    openFrom: "",
  },
  reqBookingModal: false,
  qaModal: {
    isOpen: false,
  },
  feedbackModal: {
    isOpen: false,
  },
  shareModal: {
    isOpen: false,
  },
};

export const otherReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOAD_STATES_CITIES:
      return {
        ...state,
        locations: payload,
      };
    case LOGIN_MODAL:
      return {
        ...state,
        loginModal: payload,
      };
    case SIGNUP_MODAL:
      return {
        ...state,
        signupModal: payload,
      };
    case SIGNUP_WITH_PHONE_MODAL:
      return {
        ...state,
        phoneModal: payload,
      };
    case REQ_BOOKING_MODAL:
      return {
        ...state,
        reqBookingModal: payload,
      };
    case QA_MODAL:
      return {
        ...state,
        qaModal: payload,
      };
    case FEEDBACK_MODAL:
      return {
        ...state,
        feedbackModal: payload,
      };
    case SHARE_MODAL:
      return {
        ...state,
        shareModal: payload,
      };
    default:
      return state;
  }
};
