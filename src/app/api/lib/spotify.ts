export type ImageObject = {
    url: string;
    height: number | null;
    width: number | null;
};

export type TrackObject = {
    album: AlbumObject;
    artists: Array<ArtistObject>;
    available_markets: Array<string>;
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: { isrc: string };
    external_urls: { spotify: string };
    href: string;
    id: string;
    is_local: boolean;
    name: string;
    popularity: number;
    preview_url: string | null;
    track_number: number;
    type: "track";
    uri: string;
};

export type AlbumObject = {
    album_type: string;
    artists: Array<ArtistObject>;
    available_markets: Array<string>;
    external_urls: { spotify: string };
    href: string;
    id: string;
    images: Array<ImageObject>;
    name: string;
    release_date: string;
    release_date_precision: string;
    total_tracks: number;
    type: "album";
    uri: string;

}

export type ArtistObject = {
    external_urls: { spotify: string };
    followers: { href: string | null; total: number };
    genres: Array<string>;
    href: string;
    id: string;
    images: Array<ImageObject>;
    name: string;
    popularity: number;
    type: "artist";
    url: string;
    uri: string;
};


export enum ItemResponseType {
    Artists = "artists",
    Tracks = "tracks",
}

export const isItemType = (value: string): value is ItemResponseType => {
    return value === ItemResponseType.Artists || value === ItemResponseType.Tracks;
};


export enum TimeRange {
    LongTerm = "long_term",
    MediumTerm = "medium_term",
    ShortTerm = "short_term",
}
export const isTimeRange = (
    value: string
): value is TimeRange => {
    return (
        value === "long_term" ||
        value === "medium_term" ||
        value === "short_term"
    );
};

export type UserTopItemsResponse = { 
    href: string;
    limit: number;
    offset: number;
    previous: string;
    next: string;
    total: number;
    items: Array<TrackObject | ArtistObject>;
};

export const userTopItems = async ({
    accessToken,
    type,
    time_range,
}: {
    accessToken: string;
    type: ItemResponseType;
    time_range: TimeRange;
}) => {
    return fetch(
        `https://api.spotify.com/v1/me/top/${type}?time_range=${time_range}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
};

export const startPlayback = async (
    accessToken: string,
    current_device?: string,
    body?: { uris?: Array<string>, context_uri?: string, offset?: { position: number }, position_ms: number }
) => {
    const url = new URL("https://api.spotify.com/v1/me/player/play");
    const params = new URLSearchParams();
    current_device && params.set('device_id', current_device);
    url.search = params.toString();
    return fetch(
        url,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        }
    );
};

export const getPlaybackState = async (accessToken: string | undefined) => {
    if (!accessToken) {
        throw new Error("No access token provided");
    } 
    return fetch("https://api.spotify.com/v1/me/player", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const transferPlayback = async (
    accessToken: string | undefined,
    device_id: string
) => {
    if (!accessToken) {
        throw new Error("No access token provided");
    } 
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
