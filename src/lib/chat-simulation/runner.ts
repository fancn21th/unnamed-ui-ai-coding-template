/**
 * 流式输出：将文本按字符逐步输出
 */
export function streamText(
  text: string,
  onUpdate: (partial: string) => void,
  options?: { charsPerTick?: number; tickInterval?: number },
): Promise<void> {
  const charsPerTick = options?.charsPerTick ?? 2;
  const tickInterval = options?.tickInterval ?? 30;

  return new Promise((resolve) => {
    let index = 0;

    const tick = () => {
      const next = Math.min(index + charsPerTick, text.length);
      onUpdate(text.slice(0, next));
      index = next;

      if (index >= text.length) {
        resolve();
      } else {
        setTimeout(tick, tickInterval);
      }
    };

    tick();
  });
}

/**
 * 延迟指定毫秒数
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
