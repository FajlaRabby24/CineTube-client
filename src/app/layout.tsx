import { ThemeProvider } from "@/providers/ThemeProvider";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Toaster } from "sonner";
import QueryProviders from "../providers/QueryProvider";
import "./globals.css";

const poppins = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});
export const metadata: Metadata = {
  title: "CineTube",
  description: "A movie streaming platform",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} ${poppins.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster richColors position="top-center" duration={2000} />
          <QueryProviders>{children}</QueryProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
