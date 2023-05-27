import {
  LOAD_USER_SUCCESS,
  LOAD_USER_FAILURE,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  IS_PHONE_SIGNUP_COMPLETE,
} from "../actions/types";

const initialState = {
  isPhoneSignupComplete: null,
  isAuthenticated: false,
  user: null,
};

const authReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOAD_USER_SUCCESS:
      return {
        ...state,
        user: payload,
        isAuthenticated: true,
      };
    case LOAD_USER_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isPhoneSignupComplete: false,
      };
    case LOGOUT_FAILURE:
      return {
        ...state,
      };
    case IS_PHONE_SIGNUP_COMPLETE:
      return {
        ...state,
        isPhoneSignupComplete: payload,
      };
    default:
      return state;
  }
};

export default authReducer;
