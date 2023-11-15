import { Loader2Icon } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex flex-col flex-grow justify-center items-center h-fit m-8">
            <Loader2Icon className="h-12 w-12 animate-spin" />
            <span className="text-xl font-bold sr-only">Loading</span>
        </div>
    );
}