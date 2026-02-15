import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { text } = req.body;

  if (!text || typeof text !== "string") {
    res.status(400).json({ error: "text is required" });
    return;
  }

  try {
    const url = new URL("https://inputtools.google.com/request");
    url.searchParams.set("text", text);
    url.searchParams.set("itc", "ja-t-i0-und");
    url.searchParams.set("num", "5");

    const response = await fetch(url.toString());
    const data = await response.json();

    // Response: ["SUCCESS", [["input", ["candidate1", ...], ...]]]
    if (data[0] !== "SUCCESS") {
      res.status(500).json({ error: "変換に失敗しました" });
      return;
    }

    const candidates: string[] = data[1][0][1];
    res.json({ result: candidates[0], candidates });
  } catch (error) {
    console.error("Conversion error:", error);
    res.status(500).json({ error: "変換に失敗しました" });
  }
}
