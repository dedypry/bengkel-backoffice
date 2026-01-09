import { store } from "@/stores";

export const hasRoles = (targetRoles: string | string[]): boolean => {
  const userRoles = store.getState().auth.user?.roles;

  if (!userRoles) return false;
  if (Array.isArray(targetRoles)) {
    return userRoles.some((role) => targetRoles.includes(role.slug));
  }

  return userRoles.some((role) => role.slug === targetRoles);
};

export const IS_SUPER_ADMIN = hasRoles("super-admin");
