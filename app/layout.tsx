import type { Metadata } from "next";
import { rubik } from "@/app/ui/fonts";
import "./ui/global.css";

export const metadata: Metadata = {
  title: "Event Sorcerer",
  description: "Plan events like it's magic!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${rubik.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
