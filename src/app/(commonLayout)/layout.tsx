import { Navbar } from "@/components/layouts/Navbar";
import { getUserInfo } from "../../services/Auth/getMe.service";

export default async function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const userInfo = await getUserInfo();
  return (
    <>
      <Navbar userInfo={userInfo} />
      {children}
    </>
  );
}
