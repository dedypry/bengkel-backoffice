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

## Pusher user channel — jangan disconnect/unsubscribe di cleanup hook — 2026-08-10
- **Konteks:** Logout realtime sesi gagal; notifikasi memutus listener `session.revoked`.
- **Penyebab:** cleanup `disconnectPusher`/`unsubscribe`; listener menunggu Redux `user.id`; auth header Pusher stale; tanpa `session_id` event diabaikan.
- **Pola:** `getUserChannel` + `bind` only; subscribe pakai `getUserIdFromToken()` (JWT); custom Pusher `authorizer` via `http.post('/notifications/pusher/auth')` (bukan `fetch`); handler `session.revoked` → `forceLogout` / verify `GET /user/sessions`; `window.location.replace('/login')`.
- **File:** `src/utils/libs/pusher.ts`, `src/hooks/use-user-realtime.ts`, `src/utils/helpers/auth-session.ts`

## Warna teks secondary bukan default — 2026-08-10
- **Konteks:** Halaman log aktivitas pakai `text-default-*` — kurang selaras brand.
- **Pola:** Label `text-secondary-500`, body `text-secondary-600/700`, muted `text-secondary-400`, border `border-secondary-100`. Set HeroUI `classNames` di Table/User/Input/Modal.
- **File:** `src/pages/logs/activity/`, `src/pages/logs/components/activity-body-modal.tsx`, `logs-filters-bar.tsx`, rule `frontend-gotchas.mdc`

## HTTP client — pakai axios `http`, bukan fetch — 2026-08-10
- **Konteks:** Pusher auth pakai `fetch` manual padahal sudah ada `src/utils/libs/axios.ts`.
- **Pola:** Semua call backend API → `http.get/post/...` path relatif; auth + 401 logout otomatis. Rule `http-client.mdc`.
- **File:** `src/utils/libs/pusher.ts`, `src/utils/libs/axios.ts`
