import type { Metadata } from "next";
import NextAuthProvider from "@/app/context/NextAuthProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import { Inter } from "next/font/google";
import "./globals.css";
import SideMenu from "./components/SideMenu";
import { Suspense } from "react";
import Loading from "./loading";

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
            <body className={inter.className}>
                <NextAuthProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <div className="grid-container grid grid-cols-6">
                            <div className="col-start-1 col-span-1 col-end-2">
                                <SideMenu />
                            </div>
                            <div className="col-start-2 col-end-12 flex flex-col p-2">
                                {/* <ToggleTheme /> */}
                                
                                <div className="flex-grow mt-12">
                                    <Suspense fallback={<Loading/>}>
                                    {children}
                                    </Suspense>
                                </div>
                                <div className="col-start-2">
                                    {/* <Player /> */}
                                </div>
                            </div>
                        </div>
                    </ThemeProvider>
                </NextAuthProvider>
            </body>
        </html>
    );
}
