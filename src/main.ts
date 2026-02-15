import { bind, unbind } from "wanakana";
import { convertToKanji } from "./converter";

const input = document.getElementById("input") as HTMLTextAreaElement;
const convertBtn = document.getElementById("convert-btn") as HTMLButtonElement;
const output = document.getElementById("output") as HTMLDivElement;
const copyBtn = document.getElementById("copy-btn") as HTMLButtonElement;

// ローマ字入力をリアルタイムでひらがなに変換
bind(input, { IMEMode: true });

convertBtn.addEventListener("click", async () => {
  const text = input.value.trim();
  if (!text) return;

  convertBtn.disabled = true;
  convertBtn.textContent = "変換中...";
  output.textContent = "";

  try {
    const result = await convertToKanji(text);
    output.textContent = result;
    copyBtn.disabled = false;
  } catch {
    output.textContent = "変換に失敗しました。もう一度お試しください。";
  } finally {
    convertBtn.disabled = false;
    convertBtn.textContent = "変換";
  }
});

copyBtn.addEventListener("click", () => {
  const text = output.textContent;
  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    const original = copyBtn.textContent;
    copyBtn.textContent = "コピーしました!";
    setTimeout(() => {
      copyBtn.textContent = original;
    }, 1500);
  });
});
