export interface DigitalCredential extends Credential {
  readonly protocol: string;
  readonly data: string | object;
}
