function clamp255(value: number): number {
  return Math.max(0, Math.min(255, value));
}

/** Éclaircit (amount > 0, vers blanc) ou assombrit (amount < 0, vers noir) une couleur hex. */
export function shade(hex: string, amount: number): string {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!match) return hex;
  const [r, g, b] = [match[1], match[2], match[3]].map((h) => parseInt(h, 16));
  const mix = (channel: number) => (amount >= 0 ? channel + (255 - channel) * amount : channel + channel * amount);
  const toHex = (channel: number) => clamp255(Math.round(channel)).toString(16).padStart(2, '0');
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
}
