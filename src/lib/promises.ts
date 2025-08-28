/**
 * no processes, just async function with delay to finish
 * @param delay in milliseconds
 * @example
 * await sleep(1000);
 */
export async function sleep(delay: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, delay));
} 