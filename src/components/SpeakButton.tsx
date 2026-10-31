import { canSpeak, speak } from "../utils/speak";

interface SpeakButtonProps {
  text: string;
  slow?: boolean;
}

export default function SpeakButton({ text, slow = false }: SpeakButtonProps) {
  if (!canSpeak) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speak(text, slow);
      }}
      title={slow ? "Escuchar despacio" : "Escuchar pronunciación"}
      aria-label={slow ? `Escuchar ${text} despacio` : `Escuchar ${text}`}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm transition hover:bg-indigo-600"
    >
      {slow ? "🐢" : "🔊"}
    </button>
  );
}