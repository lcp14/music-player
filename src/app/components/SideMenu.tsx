"use client";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { signOut, signIn } from "next-auth/react";

import {
    LayoutDashboardIcon as DashboardIcon,
    DiscIcon,
    User2Icon as PersonIcon,
    MoreVerticalIcon,
    Music2Icon,
    PodcastIcon,
    SearchIcon,
} from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Moon, Sun } from "lucide-react";

function Settings() {
    const { theme, setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    className="flex justify-normal gap-2 align-baseline text-base"
                    variant={"ghost"}
                >
                    <MoreVerticalIcon size={18} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem
                    onClick={() => {
                        signIn('spotify');
                    }}
                > Sign in with Spotify </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => {
                        signOut();
                    }}
                >
                    {" "}
                    Logout{" "}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            setTheme(theme === "light" ? "dark" : "light");
                        }}
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default function SideMenu() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-screen shadow-lg border-r p-4">
            <div className="flex align-middle justify-center mb-6">
                {" "}
                <h2 className="font-semibold my-2 font-xl flex-grow">
                    My Music Player
                </h2>{" "}
                <Settings />
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
                            <DashboardIcon size={16}/> <span> For you </span>
                        </Link>
                    </Button>
                    <Button
                        variant={pathname === "/browse" ? "secondary" : "ghost"}
                        className="flex justify-normal gap-2 align-baseline text-base"
                        asChild
                    >
                        <Link href="/browse">
                            <SearchIcon size={16}/> <span> Browse </span>{" "}
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
                            <Music2Icon size={16}/>
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
                        <PersonIcon size={16}/> <span> Artists </span>{" "}
                    </Button>
                    <Button
                        className="flex justify-normal gap-2 align-baseline text-base"
                        variant={pathname === "/albums" ? "secondary" : "ghost"}
                    >
                        {" "}
                        <DiscIcon size={16}/> <span> Albums </span>{" "}
                    </Button>
                    <Button
                        className="flex justify-normal gap-2 align-baseline text-base"
                        variant={
                            pathname === "/podcasts" ? "secondary" : "ghost"
                        }
                    >
                        <PodcastIcon size={16}/> <span> Podcasts </span>{" "}
                    </Button>
                </div>
            </div>
            <div className="flex flex-col gap-2 my-2">
                <span className="font-semibold font-lg"> Playlists </span>
            </div>
        </div>
    );
}
