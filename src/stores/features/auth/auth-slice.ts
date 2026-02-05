import type { ICompany, IUser } from "@/utils/interfaces/IUser";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { getProfile, setStoreCompany } from "./auth-action";

import { navigation } from "@/utils/navigation/sidebar-nav";

interface INav {
  roles?: string[];
  title: string;
  url: string;
  icon?: string;
  items?: {
    roles?: string[];
    title: string;
    url: string;
  }[];
}
const initialState = {
  token: "",
  user: null as IUser | null,
  company: null as ICompany | null,
  navigations: [] as INav[],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setNavigation: (state, action) => {
      state.navigations = action.payload;
    },
    setAuth: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.company = action.payload.companies[0];
    },
    setCompany: (state, action) => {
      state.company = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },

    authClear: (state) => {
      state.user = null;
      state.company = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(getProfile.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.user = action.payload;
        state.company = action.payload.companies.find(
          (e) => e.id === action.payload.company_id,
        )!;
        const userPermissions: string[] = action.payload.permissions || [];

        const filterNav = (navItems: any[]): any[] => {
          return (
            navItems
              .filter((nav) => {
                // 1. Cek Permission (jika ada)
                const hasPermission = nav.permissions
                  ? nav.permissions.some((p: string) =>
                      userPermissions.includes(p),
                    )
                  : true;

                return hasPermission;
              })
              .map((nav): any => {
                // 3. Jika punya sub-items, filter juga sub-itemsnya secara rekursif
                if (nav.items) {
                  return {
                    ...nav,
                    items: filterNav(nav.items),
                  };
                }

                return nav;
              })
              // 4. Buang menu utama jika sub-items nya kosong (opsional)
              .filter((nav) => !nav.items || nav.items.length > 0)
          );
        };

        state.navigations = filterNav(navigation);
      })
      .addCase(setStoreCompany.fulfilled, (state, action) => {
        state.company = action.payload;
      }),
});

export const { setAuth, authClear, setCompany, setToken } = authSlice.actions;
export default authSlice.reducer;
