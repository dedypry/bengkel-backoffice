import "@/assets/css/index.css";
import type { IChild } from "@/utils/interfaces/global";

import { Provider } from "react-redux";

import { store } from "@/stores";

export default function LayoutProvider({ children }: IChild) {
  return <Provider store={store}>{children}</Provider>;
}
