import { Volume2 } from 'lucide-react';
import { canSpeak, speak } from '../lib/speech';

export function SpeakButton({ text, label }: { text: string; label: string }) {
  if (!canSpeak) return null;
  return (
    <button
      type="button"
      onClick={() => speak(text)}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-line/60 hover:text-text"
      aria-label={label}
      title={label}
    >
      <Volume2 className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
