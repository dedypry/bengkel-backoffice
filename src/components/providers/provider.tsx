import "@/assets/css/index.css";
import type { IChild } from "@/utils/interfaces/global";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import Loading from "../loading/Loading";

import { persistor, store } from "@/stores";

export default function LayoutProvider({ children }: IChild) {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
