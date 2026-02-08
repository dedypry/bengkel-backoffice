import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/utils/libs/axios";
import { notifyError } from "@/utils/helpers/notify";

export const getProfile = createAsyncThunk("get-profile", async () => {
  try {
    const { data } = await http.get("auth/profile");

    return data;
  } catch (error) {
    console.error(error);

    return null;
  }
});

export const setStoreCompany = createAsyncThunk(
  "store-company",
  async (id: number, { dispatch }) => {
    try {
      const { data } = await http.post("/user/company", {
        company_id: id,
      });

      dispatch(getProfile());

      return data;
    } catch (error) {
      notifyError(error as any);
    }
  },
);
