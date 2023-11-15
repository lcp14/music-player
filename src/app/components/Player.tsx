"use client";
import { Button } from "@/components/ui/button";
import {
    PauseIcon,
    PlayIcon,
    SkipBackIcon,
    SkipForwardIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { getPlaybackState, transferPlayback } from "../api/lib/spotify";
import Image from "next/image";
import Loading from "../loading";
import { usePlayer } from "../context/SpotifyProvider";


export async function isPlaybackStateActive(accessToken: string) {
    const response = await getPlaybackState(accessToken);
    if (response.status === 204) {
        return false;
    }
    return true;
}

export async function playerTransferPlayback(accessToken: string, currentDevice: string) {
    console.info("No active device found, transfering playback");
    const res = await transferPlayback(
        accessToken,
        currentDevice
    );
    if (res.status === 202) {
        return;
    }
    console.error("Error: Transfering playback failed");
    return;
}

export async function togglePlay(accessToken: string, player: Spotify.SpotifyPlayer, currentDevice: string) {
    if(await isPlaybackStateActive(accessToken)) { 
        await player?.togglePlay();
        return;
    }
    await playerTransferPlayback(accessToken, currentDevice);
}

export default function Player() {
    const { data: session } = useSession();
    const { player, currentDevice, currentTrack, isPaused, isActive } = usePlayer();

    if(!player) {
        return <Loading></Loading>;
    }
    if (!session) {
        return <Loading></Loading>;
    }

    const accesToken = session?.accessToken;

    return (
        <div className="shadow-lg py-2 border-t rounded-sm">
            {currentTrack && currentTrack.name !== "" && (
                <div className="flex flex-col items-center justify-center gap-2 my-2">
                    <div>
                        <Image
                            src={currentTrack.album?.images[0].url}
                            width={120}
                            height={120}
                            alt={currentTrack.album?.name}
                        />
                    </div>
                    <div>
                        {" "}
                        {currentTrack.name} - {currentTrack?.artists[0].name}
                    </div>
                </div>
            )}
            <div className="flex flex-row gap-2 items-center justify-center">
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                        player?.previousTrack();
                    }}
                >
                    <SkipBackIcon size={16}></SkipBackIcon>
                </Button>
                <Button
                    size="icon"
                    className="rounded-full transition"
                    onClick={async () => {
                        await togglePlay(accesToken, player, currentDevice);
                    }}
                >
                    {!isPaused && isActive ? <PauseIcon size={16}/> : <PlayIcon size={16}></PlayIcon>}{" "}
                </Button>
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                        player?.nextTrack();
                    }}
                >
                    <SkipForwardIcon size={16}></SkipForwardIcon>
                </Button>
            </div>
        </div>
    );
}
