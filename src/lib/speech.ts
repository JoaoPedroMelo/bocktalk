import { speakable } from './spoken';

let voice: SpeechSynthesisVoice | null | undefined;

function usVoice(): SpeechSynthesisVoice | null {
  if (voice !== undefined && voice !== null) return voice;
  const voices = window.speechSynthesis.getVoices();
  voice = voices.find((v) => v.lang === 'en-US' && /natural|google|samantha|aria|jenny/i.test(v.name)) ?? voices.find((v) => v.lang === 'en-US') ?? null;
  return voice;
}

export const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

export function speak(text: string): void {
  if (!canSpeak) return;
  // Every utterance goes through speakable(), so a blank is never read out, whatever the caller passes.
  const clean = speakable(text).replace(/["“”]/g, '');
  if (!clean) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = 'en-US';
  u.rate = 0.92;
  const v = usVoice();
  if (v) u.voice = v;
  window.speechSynthesis.speak(u);
}
