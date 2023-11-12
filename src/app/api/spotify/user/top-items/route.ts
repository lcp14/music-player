import { getServerSession } from "next-auth";
import { userTopItems } from "../../../lib/spotify";
import { authOptions } from "../../../lib/auth";
import { NextRequestWithAuth } from "next-auth/middleware";

enum ItemType {
    Artists = "artists",
    Tracks = "tracks",
}

function trackTransform(item) {
    return {
        img: item.album.images[0].url,
        title: item.name,
        description: item.artists.map((artist) => artist.name).join(", "),
    };
}

function artistTransform(item) {
    return {
        img: item.images[0].url,
        title: item.name,
        description: "",
    };
}

async function GET(request: NextRequestWithAuth) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }
    const time_range =
        request.nextUrl.searchParams.get("time_range") || "short_term";
    const type = request.nextUrl.searchParams.get("type") || "tracks";

    const response = await userTopItems({
        accessToken: session.accessToken,
        type,
        time_range,
    });

    const { items } = await response.json();

    const data = items.map(
        type === ItemType.Tracks ? trackTransform : artistTransform
    );

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
