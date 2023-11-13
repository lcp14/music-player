import { getServerSession } from "next-auth";
import {
    type ArtistObject,
    type TrackObject,
    UserTopItemsResponse,
    userTopItems,
    ItemType,
    TimeRange,
    isItemType,
    isTimeRange,
} from "../../../lib/spotify";
import { authOptions } from "../../../lib/auth";
import { NextRequestWithAuth } from "next-auth/middleware";

function trackTransform(item: TrackObject) {
    return {
        img: item.album.images[0].url,
        title: item.name,
        description: item.artists.map((artist) => artist.name).join(", "),
        uri: item.uri, 
    };
}

function artistTransform(item: ArtistObject) {
    return {
        img: item.images[0].url,
        title: item.name,
        description: "",
        uri: item.uri,
    };
}

async function GET(request: NextRequestWithAuth) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }
    const time_range = request.nextUrl.searchParams.get("time_range") ?? TimeRange.ShortTerm; 
    const type = request.nextUrl.searchParams.get("type") ?? ItemType.Tracks;

    if(!isItemType(type) || !isTimeRange(time_range)) { 
        return new Response("Bad Request", { status: 400 });
    }

    const response = await userTopItems({
        accessToken: session.accessToken,
        type,
        time_range,
    });

    const { items } = (await response.json()) as UserTopItemsResponse;

    type TransformFunction = {
        (item: TrackObject | ArtistObject): {
            img: string;
            title: string;
            description: string;
        };
    };

    const transform: TransformFunction = (item) => {
        if (item.type === 'track') {
            return trackTransform(item);
        } else {
            return artistTransform(item);
        }
    };
    const data = items.map(transform);

    return Response.json(
        { items: data },
        {
            status: 200,
            headers: {
                "content-type": "application/json",
                "cache-control":
                    "public, s-maxage=86400, stale-while-revalidate=43200",
            },
        }
    );
}

export { GET };
