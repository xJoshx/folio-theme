import type { Metadata } from "next";

export const metadata: Metadata = { title: "Theme fixture" };

export default async function Page() {
  const data = await Promise.resolve({ status: "ready" });
  return <main><h1>Next.js</h1><output>{data.status}</output></main>;
}
