import { getStore } from "@netlify/blobs";
export const facebookStore = () =>
  getStore({ name: "idlogice-facebook", consistency: "strong" });
