export function convertToParameters(args: unknown[]): string[] {
  return [...args.keys()].map(i => `$${i + 1}`);
}
