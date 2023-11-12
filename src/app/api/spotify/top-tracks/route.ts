import { getServerSession } from "next-auth";
import { userTopItems } from "../../lib/spotify";
import { authOptions } from "../../lib/auth";
import { NextRequest } from "next/server";

async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const time_range = request.nextUrl.searchParams.get('time_range') || 'short_term';
  const type = request.nextUrl.searchParams.get('type') || 'tracks';

  const response = await userTopItems({ accessToken: session.accessToken, type, time_range });
  const { items } = await response.json();
 
  return Response.json({ items }, {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, s-maxage=86400, stale-while-revalidate=43200'
    }
  });
}

export { GET }