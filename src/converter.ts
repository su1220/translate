export async function convertToKanji(hiragana: string): Promise<string> {
  const response = await fetch("/api/convert", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: hiragana }),
  });

  if (!response.ok) {
    throw new Error("変換に失敗しました");
  }

  const data = await response.json();
  return data.result;
}
