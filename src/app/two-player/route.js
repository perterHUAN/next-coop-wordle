import createServerSocket from "@/socket/createServerSocket";
export async function GET() {
  const roomId = createServerSocket();
  return Response.json({ roomId });
}
