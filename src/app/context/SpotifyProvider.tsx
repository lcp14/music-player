"use client"
import { useContext, createContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { TrackObject } from "../api/lib/spotify";

const PlayerContext = createContext<PlayerState>({} as PlayerState);

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error("usePlayer must be used within a PlayerProvider");
    }
    return context;
};

interface PlayerState {
  player: Spotify.SpotifyPlayer | null;
  currentTrack: TrackObject | null;
  currentDevice: string;
  isPaused: boolean;
  isActive: boolean;
}


export function usePlayerHook(): PlayerState {
    const { data: session } = useSession();
    const [player, setPlayer] = useState<Spotify.SpotifyPlayer>();
    const [is_loaded, setLoaded] = useState(false);
    const [currentTrack, setTrack] = useState<TrackObject | null>(null);
    const [currentDevice, setDevice] = useState("");
    const [isPaused, setPaused] = useState(false);
    const [isActive, setActive] = useState(false);

    useEffect(() => {
        if (!session?.accessToken) return;
        if (player) return;
        if (is_loaded) return;
        /* Append Spotify SDK  */
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);
        /* Initialize Player */
        window.onSpotifyWebPlaybackSDKReady = () => {
            const token = session?.accessToken;
            const spotifyPlayer = new Spotify.Player({
                name: "Web Playback SDK Quick Start Player",
                getOAuthToken: (cb: any) => {
                    cb(token);
                },
                volume: 0.5,
            });

            setPlayer(spotifyPlayer);
            setLoaded(true);
        };
        return () => {
            document.body.removeChild(script);
        };
    }, [session?.accessToken, player, is_loaded]);

    if (player) {
        player.addListener("ready", ({ device_id }) => {
            console.log("Ready with Device ID", device_id);
            setDevice(device_id);
        });
        player.addListener("player_state_changed", (state) => {
            if (!state) {
                return;
            }
            setTrack(state.track_window.current_track);
            setPaused(state.paused);

            player.getCurrentState().then((state) => {
                !state ? setActive(false) : setActive(true);
            });
        });
        player.connect();
    }

    return {
        player,
        currentDevice,
        currentTrack,
        isPaused,
        isActive
    };
}

export function SpotifyProvider({ children}: { children: React.ReactNode }) {
    const player = usePlayerHook();

    return (
        <PlayerContext.Provider value={player}>
            {children}
        </PlayerContext.Provider>
    );
}
