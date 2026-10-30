import { getStore } from "@netlify/blobs";
export const xStore = () =>
  getStore({ name: "idlogice-x", consistency: "strong" });
