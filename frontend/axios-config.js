import axios from "axios";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

import { API } from "./config";
import { auth } from "./firebase";

export const client = axios.create({
  baseURL: API,
});

export const auth_client = axios.create({
  baseURL: `${API}account/`,
});

auth_client.interceptors.request.use(async (req) => {
  const access = Cookies.get("access") ?? false;
  if (access) {
    req.headers.Authorization = `Bearer ${access}`;
  } else {
    return req;
  }

  const user = jwt_decode(access);
  const isExpired = dayjs(user.exp).diff(dayjs().unix()) < 1;

  if (!isExpired) return req;

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const token = await user.getIdToken();
      Cookies.set("access", token);
      req.headers.Authorization = `Bearer ${token}`;
    }
  });

  return req;
});
