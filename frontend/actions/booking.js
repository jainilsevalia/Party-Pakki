import { auth_client } from "../axios-config";
import { loadUser } from "./auth";

export const requestBooking = (obj) => async (dispatch) => {
  try {
    const res = await auth_client.post("booking/", obj);
    if (res.status === 201) {
      dispatch(loadUser());
      return {
        status: 201,
        success: res.data.success,
      };
    }
  } catch (error) {
    return {
      status: 500,
      error: "Something went wrong",
    };
  }
};

export const updateRemarks =
  ({ uuid, remarks }) =>
  async (dispatch) => {
    try {
      const res = await auth_client.patch(`booking/${uuid}/`, {
        remarks,
      });
      if (res.status === 200) {
        dispatch(loadUser());
        return {
          status: 200,
          success: res.data.success,
        };
      }
    } catch (error) {
      return {
        status: 500,
        error: "Something went wrong",
      };
    }
  };
