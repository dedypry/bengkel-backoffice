# Service & Work Order UI

## Datetime

- Komponen: `src/components/forms/date-time-picker.tsx`
- Format value: `YYYY-MM-DD HH:mm:ss` (`DATETIME_VALUE_FORMAT`)
- Helper: `src/utils/helpers/dayjs.ts` — `formatWorkOrderDateTime*`, `toWorkOrderDateTimeInput`
- Form register: `src/pages/service/add/index.tsx` — field `created_at`
- Edit detail: `src/pages/service/queue/components/edit-order-date.tsx`

## Queue

- Page: `src/pages/service/queue/index.tsx` — stats cards
- Table: `components/list-table.tsx` — tabs, skeleton, empty state
- Realtime: hook `use-service-queue-realtime`

## Stack

HeroUI, Redux (`stores/features/work-order/`), react-hook-form + zod, i18n `src/utils/lang/`
