/**
 * 与业务侧 runner 逻辑一致的纯函数副本，供本目录内测试自包含使用。
 * 脱库上传时无需改 import 路径。
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

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
