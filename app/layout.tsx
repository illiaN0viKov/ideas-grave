import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ideas-grave",
  description: "Minimal auth landing with sign in, sign up, and log out flows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className='min-h-screen bg-white selection:bg-black/10 selection:text-slate-950 text-slate-950'>
        {children}
      </body>
    </html>
  );
}
