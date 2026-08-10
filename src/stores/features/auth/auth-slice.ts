import type { ICompany, IUser } from "@/utils/interfaces/IUser";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { getProfile, setStoreCompany } from "./auth-action";

import { navigation } from "@/config/navigations";

interface INav {
  roles?: string[];
  header: string;
  title: string;
  i18nKey?: string;
  href: string;
  icon?: string;
  items?: {
    roles?: string[];
    title: string;
    i18nKey?: string;
    href: string;
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
        const userRoleSlugs =
          action.payload.roles?.map((role) => role.slug) ?? [];

        const filterNav = (navItems: any[], parentRoles?: string[]): any[] => {
          return navItems
            .filter((nav) => {
              const requiredRoles = nav.roles ?? parentRoles;
              const hasRole = requiredRoles
                ? requiredRoles.some((role: string) =>
                    userRoleSlugs.includes(role),
                  )
                : true;
              const hasPermission = nav.permissions
                ? nav.permissions.some((p: string) =>
                    userPermissions.includes(p),
                  )
                : true;

              return hasRole && hasPermission;
            })
            .map((nav): any => {
              if (nav.items) {
                return {
                  ...nav,
                  items: filterNav(nav.items, nav.roles ?? parentRoles),
                };
              }

              return nav;
            })
            .filter((nav) => !nav.items || (nav.items || []).length > 0);
        };

        state.navigations = filterNav(navigation);
      })
      .addCase(setStoreCompany.fulfilled, (state, action) => {
        state.company = action.payload;
      }),
});

export const { setAuth, authClear, setCompany, setToken } = authSlice.actions;
export default authSlice.reducer;
