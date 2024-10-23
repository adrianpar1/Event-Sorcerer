import "@/app/ui/global.css";
import { rubik } from "@/app/ui/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: {
      template: "%s | Event Sorcerer",
      default: "Event Sorcerer",
   },
   description: "The official Next.js Course Dashboard, built with App Router.",
   metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
};

export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <html lang="en">
         <body className={`${rubik.className} antialiased`}>{children}</body>
      </html>
   );
}
