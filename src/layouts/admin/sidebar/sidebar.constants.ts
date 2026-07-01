export const SIDEBAR_SURFACE_CLASS =
  "bg-gradient-to-tr from-primary-900 to-primary-600 shadow-lg shadow-primary-200";

export const SIDEBAR_EXPANDED_WIDTH = 260;
export const SIDEBAR_COLLAPSED_WIDTH = 72;

export const sidebarWidthTransition = {
  duration: 0.42,
  ease: [0.4, 0, 0.2, 1] as const,
};

export const sidebarLabelTransition = {
  duration: 0.32,
  ease: [0.4, 0, 0.2, 1] as const,
};

export const submenuTransition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1] as const,
};

export const flyoutTransition = {
  duration: 0.22,
  ease: [0.32, 0.72, 0, 1] as const,
};
