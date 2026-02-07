/* eslint-disable react-hooks/rules-of-hooks */
import type { IChild } from "../interfaces/global";

import { Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import Cookies from "js-cookie";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getProfile } from "@/stores/features/auth/auth-action";

export default function AuthGuard({ children }: IChild) {
  const { token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const hasFetched = useRef(false);

  const accessToken = token || Cookies.get("token");

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    if (accessToken && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(getProfile());

      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [accessToken]);

  return children;
}
