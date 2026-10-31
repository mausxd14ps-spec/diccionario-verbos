export const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => v.lang === "en-US") ?? voices.find((v) => v.lang.startsWith("en")) ?? null;
}

export function speak(text: string, slow = false) {
  if (!canSpeak) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  // "was/were" se lee mejor como "was, were"
  const clean = text.replace(/\//g, ", ");
  const u = new SpeechSynthesisUtterance(slow ? clean.split(" ").join(", ") : clean);
  u.lang = "en-US";
  u.rate = slow ? 0.3 : 1;
  const voice = pickVoice();
  if (voice) u.voice = voice;
  synth.speak(u);
}