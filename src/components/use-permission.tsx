import { useAppSelector } from "@/stores/hooks";

export const usePermission = () => {
  const { user } = useAppSelector((state) => state.auth);
  const permissions = user?.permissions || [];

  /**
   * Fungsi untuk mengecek hak akses.
   * Bisa menerima string tunggal atau array string.
   * @param requiredPermissions - Nama permission atau daftar permission
   * @param type - 'all' (harus punya semua) atau 'oneOf' (punya salah satu saja cukup)
   */
  const hasPermission = (
    requiredPermissions: string | string[],
    type: "all" | "oneOf" = "oneOf",
  ): boolean => {
    if (Array.isArray(requiredPermissions)) {
      if (type === "all") {
        return requiredPermissions.every((p) => permissions.includes(p));
      }

      return requiredPermissions.some((p) => permissions.includes(p));
    }

    return permissions.includes(requiredPermissions);
  };

  return { hasPermission, permissions };
};
