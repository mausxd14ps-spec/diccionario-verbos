let ctx: AudioContext | null = null;

export function playTone(ok: boolean) {
  try {
    const w = window as unknown as { webkitAudioContext?: typeof AudioContext };
    const AC = window.AudioContext || w.webkitAudioContext;
    if (!AC) return;
    ctx = ctx ?? new AC();
    if (ctx.state === "suspended") void ctx.resume();
    const c = ctx;
    const notes = ok ? [660, 880] : [220, 160];
    const t0 = c.currentTime;
    notes.forEach((freq, i) => {
      const start = t0 + i * 0.12;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = ok ? "sine" : "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.2, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(start);
      osc.stop(start + 0.2);
    });
  } catch {
    // sin audio disponible: no pasa nada
  }
}