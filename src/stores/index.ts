import { configureStore } from "@reduxjs/toolkit";

import auth from "./features/auth/auth-slice";
import region from "./features/region/region-slice";
import role from "./features/role/role-slice";
import employe from "./features/employe/employe-slice";

export const store = configureStore({
  reducer: {
    auth,
    region,
    role,
    employe,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
