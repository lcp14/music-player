"use client";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

import { DashboardIcon, DiscIcon, PersonIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { MoreVerticalIcon } from "lucide-react";

export default function SideMenu() {
    const { data: session } = useSession();
    const pathname = usePathname();

    if (!session) return <div> Loading... </div>;

    return (
        <div className="flex flex-col h-screen shadow-lg border-r p-2">
            <div className="flex align-baseline mb-6">
                {" "}
                <h2 className="font-semibold my-2 font-xl flex-grow">My Music Player</h2>{" "}
                <Button className="" size={"icon"} variant={"ghost"}>
                    <MoreVerticalIcon />
                </Button>
            </div>
            <div className="side menu">
                <div className="flex flex-col gap-2 my-2">
                    <span className="font-semibold font-lg"> Discover </span>
                    <Button
                        className="flex justify-normal gap-2 align-baseline text-base"
                        variant={pathname === "/" ? "secondary" : "ghost"}
                        asChild
                    >
                        <Link href="/">
                            {" "}
                            <DashboardIcon /> <span> For you </span>
                        </Link>
                    </Button>
                    <Button
                        variant={pathname === "/browse" ? "secondary" : "ghost"}
                        className="flex justify-normal gap-2 align-baseline text-base"
                        asChild
                    >
                        <Link href="/browse">
                            <DashboardIcon /> <span> Browse </span>{" "}
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-col gap-2 my-2">
                    <span className="font-semibold font-lg"> Categories </span>
                    <Button
                        variant={pathname === "/songs" ? "secondary" : "ghost"}
                        className="flex justify-normal gap-2 align-baseline text-base active"
                        asChild
                    >
                        <Link href="/songs">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                            >
                                <circle cx="8" cy="18" r="4" />
                                <path d="M12 18V2l7 4" />
                            </svg>{" "}
                            <span> Songs </span>
                        </Link>
                    </Button>
                    <Button
                        variant={
                            pathname === "/artists" ? "secondary" : "ghost"
                        }
                        className="flex justify-normal gap-2 align-baseline text-base"
                    >
                        {" "}
                        <PersonIcon /> <span> Artists </span>{" "}
                    </Button>
                    <Button
                        variant="ghost"
                        className="flex justify-normal gap-2 align-baseline text-base"
                    >
                        {" "}
                        <DiscIcon /> <span> Albums </span>{" "}
                    </Button>
                    <Button
                        variant="ghost"
                        className="flex justify-normal gap-2 align-baseline text-base"
                    >
                        {" "}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                        >
                            <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12" />
                            <circle cx="17" cy="7" r="5" />
                        </svg>{" "}
                        <span> Podcasts </span>{" "}
                    </Button>
                </div>
            </div>
            <div className="flex flex-col gap-2 my-2">
                <span className="font-semibold font-lg"> Playlists </span>
            </div>
        </div>
    );
}
