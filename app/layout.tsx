import type { Metadata } from "next";
import "./globals.css";
import MusicPlayer from "@/components/MusicPlayer";
import WarpTransition from "@/components/WarpTransition";

export const metadata: Metadata = {
  title: "Sam's Solar System",
  description: "Sam's personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="warp-shell">{children}</div>
        <MusicPlayer />
        <WarpTransition />
      </body>
    </html>
  );
}
