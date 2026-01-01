/* eslint-disable react-hooks/rules-of-hooks */
import type { IChild } from "../interfaces/global";

import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getProfile } from "@/stores/features/auth/auth-action";

export default function AuthGuard({ children }: IChild) {
  const { token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const accessToken = token || Cookies.get("token");

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    if (accessToken) {
      dispatch(getProfile());
    }
  }, [accessToken]);

  return children;
}
