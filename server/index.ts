import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post("/api/convert", async (req, res) => {
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

    // Google Transliterate API returns: [[input, [candidates...]], ...]
    const result = (data as [string, string[]][])
      .map(([, candidates]) => candidates[0] || "")
      .join("");

    res.json({ result });
  } catch (error) {
    console.error("Conversion error:", error);
    res.status(500).json({ error: "変換に失敗しました" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
