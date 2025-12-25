/* eslint-disable react-hooks/rules-of-hooks */
import type { IChild } from "../interfaces/global";

import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie";

import { http } from "../libs/axios";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { setAuth } from "@/stores/features/auth/authSlice";

export default function AuthGuard({ children }: IChild) {
  const { token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const accessToken = token || Cookies.get("token");

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    if (accessToken) {
      http
        .get("auth/profile")
        .then(({ data }) => {
          dispatch(setAuth(data));
        })
        .catch((err) => console.error(err));
    }
  }, [accessToken]);

  return children;
}
