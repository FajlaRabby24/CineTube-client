import { getDefaultDashboardRoute } from "@/lib/authUtilts";
import { getNavItemsByRole } from "@/lib/navItems";
import { getUserInfo, IUserInfo } from "@/services/Auth/getMe.service";
import { NavSection } from "@/types/dashboard.types";
import DashboardNavbarContent from "./DashboardNavbarContent";

const DashboardNavbar = async () => {
  const userInfo: IUserInfo | null = await getUserInfo();
  if (!userInfo) {
    // Handle unauthenticated case - maybe redirect or show login
    return null;
  }

  const navItems: NavSection[] = getNavItemsByRole(userInfo.role);

  const dashboardHome = getDefaultDashboardRoute(userInfo.role);
  return (
    <DashboardNavbarContent
      userInfo={userInfo}
      navItems={navItems}
      dashboardHome={dashboardHome}
    />
    // <h2>Dashboard navbar</h2>
  );
};

export default DashboardNavbar;
