import { configureStore } from "@reduxjs/toolkit";

import auth from "./features/auth/auth-slice";
import region from "./features/region/region-slice";
import role from "./features/role/role-slice";
import employe from "./features/employe/employe-slice";
import service from "./features/service/service-slice";
import customer from "./features/customer/customer-slice";
import vehicle from "./features/vehicle/vehicle-slice";
import mechanic from "./features/mechanic/mechanic-slice";
import product from "./features/product/product-slice";

export const store = configureStore({
  reducer: {
    auth,
    region,
    role,
    employe,
    service,
    customer,
    vehicle,
    mechanic,
    product,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
