import { getServerSession } from "next-auth";
import { userTopItems } from "../../lib/spotify";
import { authOptions } from "../../lib/auth";

async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  const response = await userTopItems({ accessToken: session.accessToken, type: 'artists', time_range: 'short_term' });
  const { items } = await response.json();
  const artists = items.map((artist) => ({
    name: artist.name,
    coverImage: artist.images[1].url,
    genres: artist.genres,
    id: artist.id
  }));

  return Response.json({ artists }, {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, s-maxage=86400, stale-while-revalidate=43200'
    }
  });
}

export { GET }