import { configureStore } from "@reduxjs/toolkit";

import auth from "./features/auth/auth-slice";
import region from "./features/region/region-slice";
import role from "./features/role/role-slice";

export const store = configureStore({
  reducer: {
    auth,
    region,
    role,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
