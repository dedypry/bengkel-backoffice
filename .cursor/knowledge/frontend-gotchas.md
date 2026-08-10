# Frontend Gotchas — bengkel-admin

## HeroUI Table `getCollectionNode is not a function` — 2026-08-10
- **Konteks:** Tab riwayat service customer crash saat loading skeleton / empty state.
- **Penyebab:** `TableBody` children bukan collection node valid — array dari wrapper component (`<ServiceHistorySkeletonRow />`), prop `items` tanpa `columns` di `TableHeader`, atau ternary yang return array element non-`TableRow`.
- **Solusi/Pola:** Pakai `isLoading` + `loadingContent` (div skeleton, lihat categories) ATAU `map` langsung ke `<TableRow><TableCell>…</TableCell></TableRow>` inline. Jangan wrap `TableRow` di component terpisah sebagai child langsung `TableBody`.
- **File:** `src/pages/master/customers/components/detail-service.tsx`, `src/pages/inventory/categories/index.tsx`

## Redux selector key salah (`employe` vs `employee`) — 2026-08-10
- **Konteks:** `InvoiceListPage` crash: `Cannot destructure property 'list' of useAppSelector(...) as it is undefined`.
- **Penyebab:** Selector `state.employee` — reducer didaftarkan sebagai `employe` di `stores/index.ts`.
- **Solusi/Pola:** Sebelum `useAppSelector`, cek nama key di `src/stores/index.ts` (bukan `name` dari slice).
- **File:** `src/stores/index.ts`, `src/pages/finance/list.tsx`

## DateRangePicker placeholder tertutup `- -` — 2026-08-10
- **Konteks:** Filter "Semua tanggal" tidak tampil; input menampilkan `- -`.
- **Penyebab:** `dateFormat('')` return `-`; useEffect kedua overwrite `setValue("")` dari effect kosong.
- **Solusi/Pola:** Di effect format value, early return `setValue("")` jika `startDate` dan `endDate` keduanya null/kosong.
- **File:** `src/components/forms/date-range-picker.tsx`

## Payment list filter — join work_order untuk customer — 2026-08-10
- **Konteks:** Filter pelanggan di riwayat transaksi revenue.
- **Solusi/Pola:** Backend filter `work_order.customer_id`; kasir via `py.updated_by`. Query params: `customer_id`, `cashier_id`.
- **File:** `backend/apps/backend/src/api/payments/payments.service.ts`, `src/pages/finance/list.tsx`

## Loading state — Skeleton bukan Spinner — 2026-08-10
- **Konteks:** Tab perangkat login & halaman report pakai spinner centered saat fetch.
- **Pola:** Buat `*-skeleton.tsx` mirror layout konten; HeroUI `Skeleton`. Spinner hanya untuk `Button isLoading` / aksi singkat.
- **File:** `src/pages/my-profile/components/login-sessions-skeleton.tsx`, `src/pages/reports/components/revenue-skeleton.tsx`
