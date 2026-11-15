import { useEffect, useState } from 'react';

import { ThemedText, type ThemedTextProps } from '@/components/themed-text';

interface CountUpNumberProps extends Omit<ThemedTextProps, 'children'> {
  value: number;
  suffix?: string;
  duration?: number;
}

export function CountUpNumber({ value, suffix = '', duration = 700, ...rest }: CountUpNumberProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = Date.now();
    let frameId: number;
    const tick = () => {
      const progress = Math.min(1, (Date.now() - start) / duration);
      setDisplay(Math.round(value * progress));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [value, duration]);

  return (
    <ThemedText {...rest}>
      {display}
      {suffix}
    </ThemedText>
  );
}
