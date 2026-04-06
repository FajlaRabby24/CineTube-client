export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
}

export const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export const isAuthRoute = (pathName: string): boolean => {
  return authRoutes.some((route) => route === pathName);
};

export type RouteConfig = {
  exact: string[];
  pattern: RegExp[];
};

export const commonProtectedRoutes: RouteConfig = {
  exact: ["/my-profile", "/change-password"],
  pattern: [],
};

export const adminProtectedRoutes: RouteConfig = {
  pattern: [/^\/admin\/dashboard/], // Matches any path that starts with /admin/dashboard
  exact: [],
};

export const userProtectedRoutes: RouteConfig = {
  pattern: [/^\/dashboard/], // Matches any path that starts with /dashboard
  exact: [],
};

export const isRouteMatches = (
  pathName: string,
  routes: RouteConfig,
): boolean => {
  if (routes.exact.includes(pathName)) {
    return true;
  }

  return routes.pattern.some((pattern: RegExp) => pattern.test(pathName));
};

export const getRouteOwner = (
  pathName: string,
): UserRole.ADMIN | UserRole.SUPER_ADMIN | UserRole.USER | "COMMON" | null => {
  if (isRouteMatches(pathName, adminProtectedRoutes)) {
    return UserRole.ADMIN;
  }

  if (isRouteMatches(pathName, userProtectedRoutes)) {
    return UserRole.USER;
  }

  if (isRouteMatches(pathName, commonProtectedRoutes)) {
    return "COMMON";
  }

  return null;
};

export const getDefaultDashboardRoute = (role: UserRole) => {
  if (role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN) {
    return "/admin/dashboard";
  }
  if (role === UserRole.USER) {
    return "/dashboard";
  }
  return "/";
};

export const isValidRedirectForRole = (
  redirectPath: string,
  role: UserRole,
) => {
  const unifySuperAdminAndAdminRole =
    role === UserRole.SUPER_ADMIN ? UserRole.ADMIN : role;

  role = unifySuperAdminAndAdminRole;

  const routeOwner = getRouteOwner(redirectPath);

  if (routeOwner === null || routeOwner === "COMMON") {
    return true;
  }
  if (routeOwner === role) {
    return true;
  }

  return false;
};
