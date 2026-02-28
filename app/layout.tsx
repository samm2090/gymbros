import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gymbros App 🏋️‍♂️",
  description: "Trackea tus entrenos con tus gym bros",
  manifest: "/manifest.json",
  icons: {
    apple: "/icons/icon-180.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>{children}</body>
    </html>
  );
}

