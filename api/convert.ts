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
    const url = new URL("https://www.google.com/transliterate");
    url.searchParams.set("langpair", "ja-Hira|ja");
    url.searchParams.set("text", text);

    const response = await fetch(url.toString());
    const data = await response.json();

    const result = (data as [string, string[]][])
      .map(([, candidates]) => candidates[0] || "")
      .join("");

    res.json({ result });
  } catch (error) {
    console.error("Conversion error:", error);
    res.status(500).json({ error: "変換に失敗しました" });
  }
}
