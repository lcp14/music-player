"use client";
import { Button } from "@/components/ui/button";
import {
    PauseIcon,
    PlayIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
    TrackPreviousIcon,
    TrackNextIcon,
} from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getPlaybackState, transferPlayback } from "../api/lib/spotify";
import Image from "next/image";
import Loading from "../loading";
const track = {
    name: "",
    album: {
        images: [{ url: "" }],
    },
    artists: [{ name: "" }],
};

export default function Player() {
    const { data: session } = useSession();
    const [player, setPlayer] = useState(undefined);
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [current_track, setTrack] = useState(track);
    const [current_device, setDevice] = useState("");

    async function togglePlay() {
        let isActive = false;
        const response = await getPlaybackState(session.accessToken);
        if (response.status === 204) {
            console.info("No active device found, transfering playback");
            const res = await transferPlayback(
                session.accessToken,
                current_device
            );
            if (res.status === 202) {
                return;
            }
            console.error("Error: Transfering playback failed");
            return;
        }
        isActive = true;
        await player.togglePlay();
    }

    useEffect(() => {
        if (!session?.accessToken) return;
        if (player) return;

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);
        if (!window.onSpotifyWebPlaybackSDKReady) {
            window.onSpotifyWebPlaybackSDKReady = () => {
                const token = session?.accessToken;
                const player = new Spotify.Player({
                    name: "Web Playback SDK Quick Start Player",
                    getOAuthToken: (cb: any) => {
                        cb(token);
                    },
                    volume: 0.5,
                });

                setPlayer(player);

                // Ready
                player.addListener("ready", ({ device_id }) => {
                    console.log("Ready with Device ID", device_id);
                    setDevice(device_id);
                });

                // Not Ready
                player.addListener("not_ready", ({ device_id }) => {
                    console.log("Device ID has gone offline", device_id);
                });

                player.addListener("initialization_error", ({ message }) => {
                    console.error(message);
                });

                player.addListener("authentication_error", ({ message }) => {
                    console.error(message);
                });

                player.addListener("account_error", ({ message }) => {
                    console.error(message);
                });

                player.addListener("player_state_changed", (state) => {
                    if (!state) {
                        return;
                    }
                    console.log(state);
                    setTrack(state.track_window.current_track);
                    setPaused(state.paused);

                    player.getCurrentState().then((state) => {
                        !state ? setActive(false) : setActive(true);
                    });
                });
                player.connect();
            };
        }

        return () => {
            script.remove();
        };
    }, [session?.accessToken, player]);

    if (!session || !player) return <Loading/>;

    return (
        <div className="shadow-md py-2 border-t">
            {current_track.name !== "" && (
                <div className="flex flex-col items-center justify-center gap-2 my-2">
                    <div>
                        (
                        <Image
                            src={current_track.album.images[0].url}
                            width={120}
                            height={120}
                            alt={current_track.album.name}
                        />
                        )
                    </div>
                    <div>
                        {" "}
                        {current_track.name} - {current_track.artists[0].name}
                    </div>
                </div>
            )}
            <div className="flex flex-row gap-2 items-center justify-center">
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                        player.previousTrack();
                    }}
                >
                    <TrackPreviousIcon></TrackPreviousIcon>
                </Button>
                <Button
                    size="icon"
                    className="rounded-full"
                    onClick={async () => {
                        await togglePlay(session.accessToken);
                    }}
                >
                    {!is_paused ? (
                        <PauseIcon></PauseIcon>
                    ) : (
                        <PlayIcon></PlayIcon>
                    )}{" "}
                </Button>
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                        player.nextTrack();
                    }}
                >
                    <TrackNextIcon></TrackNextIcon>
                </Button>
            </div>
        </div>
    );
}
