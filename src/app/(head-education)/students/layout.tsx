import { Metadata } from "next";

export const metadata: Metadata = {
  title: "E-Learning | Danh sách sinh viên",
  icons: {
    icon: "/images/logo.jpg",
    shortcut: "/images/logo.jpg",
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
