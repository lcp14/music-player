export const userTopItems = async ({
    accessToken,
    type,
    time_range,
}: {
    accessToken: string;
    type: "artists" | "tracks";
    time_range: "long_term" | "medium_term" | "short_term";
}) => {
    return fetch(`https://api.spotify.com/v1/me/top/${type}?time_range=${time_range}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const startPlayback = async (
    accessToken: string,
    current_device: string
) => {
    return fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${current_device}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
};

export const getPlaybackState = async (accessToken: string) => {
    return fetch("https://api.spotify.com/v1/me/player", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const transferPlayback = async (
    accessToken: string,
    device_id: string
) => {
    return fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            device_ids: [device_id],
            play: true,
        }),
    });
};

export const pausePlayback = async (accessToken: string) => {
    return fetch("https://api.spotify.com/v1/me/player/pause", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};
