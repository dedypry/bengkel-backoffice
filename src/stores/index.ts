import { configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import auth from "./features/auth/auth-slice";
import region from "./features/region/region-slice";
import role from "./features/role/role-slice";
import employe from "./features/employe/employe-slice";
import service from "./features/service/service-slice";
import customer from "./features/customer/customer-slice";
import vehicle from "./features/vehicle/vehicle-slice";
import mechanic from "./features/mechanic/mechanic-slice";
import product from "./features/product/product-slice";
import wo from "./features/work-order/wo-slice";
import layout from "./features/layout/layout-slice";
import promo from "./features/promo/promo-slice";
import supplier from "./features/supplier/supplier-slice";
import payment from "./features/payments/payment-slice";
import dashboard from "./features/dashboard/dashboard-slice";
import booking from "./features/booking/booking-slice";
import expense from "./features/expense/expense-slice";

const persistedAuthReducer = persistReducer({ key: "auth", storage }, auth);
const persistedLayoutReducer = persistReducer({ key: "auth", storage }, layout);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    region,
    role,
    employe,
    service,
    customer,
    vehicle,
    mechanic,
    product,
    wo,
    layout: persistedLayoutReducer,
    promo,
    supplier,
    payment,
    dashboard,
    booking,
    expense,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
