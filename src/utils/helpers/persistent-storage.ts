/** Key prefix — tidak dihapus saat logout (lihat auth-session forceLogout). */
export const PERSISTENT_STORAGE_PREFIX = "bengkel-persist:";

export function persistentKey(suffix: string) {
  return `${PERSISTENT_STORAGE_PREFIX}${suffix}`;
}

export const INVENTORY_STOCK_TOUR_KEY = persistentKey("tour-inventory-stock");

export function snapshotPersistentStorage(): Record<string, string> {
  const snapshot: Record<string, string> = {};

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);

    if (key?.startsWith(PERSISTENT_STORAGE_PREFIX)) {
      const value = localStorage.getItem(key);

      if (value !== null) {
        snapshot[key] = value;
      }
    }
  }

  return snapshot;
}

export function restorePersistentStorage(snapshot: Record<string, string>) {
  Object.entries(snapshot).forEach(([key, value]) => {
    localStorage.setItem(key, value);
  });
}

export function isTourCompleted(key: string) {
  return localStorage.getItem(key) === "1";
}

export function markTourCompleted(key: string) {
  localStorage.setItem(key, "1");
}

export function clearTourCompleted(key: string) {
  localStorage.removeItem(key);
}
