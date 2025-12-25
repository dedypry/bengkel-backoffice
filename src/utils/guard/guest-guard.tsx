import type { IChild } from "../interfaces/global";

import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

import { useAppSelector } from "@/stores/hooks";

export default function GuestGuard({ children }: IChild) {
  const { token } = useAppSelector((state) => state.auth);

  const accessToken = token || Cookies.get("token");

  if (accessToken) {
    return <Navigate to="/" />;
  }

  return children;
}
