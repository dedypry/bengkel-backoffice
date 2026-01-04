import type { ReactNode } from "react";

export interface IChild {
  children?: ReactNode;
}

export interface IQuery {
  pageSize?: number;
  page?: number;
  q?: string;
}
