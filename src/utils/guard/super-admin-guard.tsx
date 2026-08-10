import type { IChild } from "../interfaces/global";

import { Navigate } from "react-router-dom";

import { hasRoles } from "@/utils/helpers/roles";

export default function SuperAdminGuard({ children }: IChild) {
  if (!hasRoles("super-admin")) {
    return <Navigate replace to="/" />;
  }

  return children;
}
