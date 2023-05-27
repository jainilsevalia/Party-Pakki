import { combineReducers } from "redux";

import authReducer from "./auth";
import { otherReducer } from "./other";

export default combineReducers({
  auth: authReducer,
  other: otherReducer,
});
