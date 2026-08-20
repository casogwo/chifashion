import { createRouteHandler } from "uploadthing/server";
import { ourFileRouter } from "./core";

const handler = createRouteHandler({
  router: ourFileRouter,
});

// uploadthing v7 handler accepts Request | { request: Request }
// Next.js App Router expects Request - cast to satisfy the type checker
export async function GET(request: Request) {
  return (handler as (req: Request) => Promise<Response>)(request);
}

export async function POST(request: Request) {
  return (handler as (req: Request) => Promise<Response>)(request);
}
