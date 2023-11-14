import type { Metadata } from "next";
import NextAuthProvider from "@/app/context/NextAuthProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import { Inter } from "next/font/google";
import "./globals.css";
import SideMenu from "./components/SideMenu";
import { Suspense } from "react";
import Loading from "./loading";
import Player from "./components/Player";
import { SpotifyProvider } from "./context/SpotifyProvider";
import { ScrollArea } from "@/components/ui/scroll-area";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "My Music Player",
    description: "Spotify clone built with Next.js and Chakra UI",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} overflow-hidden`}>
                <NextAuthProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <SpotifyProvider>
                            <div className="grid-container grid grid-cols-6">
                                <div className="col-start-1 col-span-1 col-end-2">
                                    <SideMenu />
                                </div>
                                <div className="col-start-2 col-end-12 flex flex-col py-2">
                                    {/* <ToggleTheme /> */}
                                    <ScrollArea className="flex-grow h-[200px]" >
                                        <Suspense fallback={<Loading />}>
                                            {children}
                                        </Suspense>
                                    </ScrollArea>
                                    <div className="col-start-2">
                                        <Player />
                                    </div>
                                </div>
                            </div>
                        </SpotifyProvider>
                    </ThemeProvider>
                </NextAuthProvider>
            </body>
        </html>
    );
}
