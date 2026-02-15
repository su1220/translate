export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { text } = await req.json();

  if (!text || typeof text !== "string") {
    return new Response(JSON.stringify({ error: "text is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const url = new URL("https://inputtools.google.com/request");
    url.searchParams.set("text", text);
    url.searchParams.set("itc", "ja-t-i0-und");
    url.searchParams.set("num", "5");

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data[0] !== "SUCCESS") {
      return new Response(JSON.stringify({ error: "変換に失敗しました" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const candidates: string[] = data[1][0][1];
    return new Response(JSON.stringify({ result: candidates[0], candidates }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Conversion error:", error);
    return new Response(JSON.stringify({ error: "変換に失敗しました" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
