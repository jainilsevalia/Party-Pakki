export const API = process.env.NEXT_PUBLIC_API;
export const URL = process.env.NEXT_PUBLIC_URL;

export const path = (path) => {
  if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
    return process.env.NEXT_PUBLIC_HOST + path;
  }
  return path;
};

export const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
export const FIREBASE_AUTH_DOMAIN =
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
export const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
export const FIREBASE_STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
export const FIREBASE_MESSAGING_SENDER_ID =
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
export const FIREBASE_APP_ID = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
export const FIREBASE_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
