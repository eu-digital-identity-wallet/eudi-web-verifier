export function userAgentAllowsProtocol(protocol: string): boolean {
  const digitalCredential = (globalThis as any).DigitalCredential as
    | { userAgentAllowsProtocol?: (protocol: string) => boolean }
    | undefined;

  return Boolean(
    digitalCredential?.userAgentAllowsProtocol?.(protocol),
  );
}

export function isDCApiSupported(): boolean {
  return typeof DigitalCredential !== 'undefined';
}
