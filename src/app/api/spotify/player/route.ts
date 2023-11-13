import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { startPlayback } from "../../lib/spotify";
import { NextRequest } from "next/server";

export async function handler(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
      return new Response("Unauthorized", { status: 401 });
  }

  const device_id = request.nextUrl.searchParams.get("device_id") ?? "";
  const body = await request.json();

  const response = await startPlayback(session.accessToken, device_id, body);

  if(response.status === 204) {
      return new Response("Success", { status: 200 });
  }

  return new Response("Bad Request", { status: 400 });
}

export { handler as PUT }
