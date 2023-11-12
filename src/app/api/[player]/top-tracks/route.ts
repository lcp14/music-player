import { getServerSession } from "next-auth";
import { userTopItems } from "../../lib/spotify";
import { authOptions } from "../../lib/auth";

async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  const response = await userTopItems({ accessToken: session.accessToken, type: 'tracks', time_range: 'short_term' });
  const { items } = await response.json();
  const tracks = items.slice(0, 10).map((track) => ({
    artist: track.artists.map((_artist) => _artist.name).join(', '),
    songUrl: track.external_urls.spotify,
    coverImage: track.album.images[1].url,
    title: track.name,
    id: track.id
  }));

  return Response.json({ tracks }, {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, s-maxage=86400, stale-while-revalidate=43200'
    }
  });
}

export { GET }