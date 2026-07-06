import { WalletResponse } from "@app/core/models/WalletResponse";

interface DigitalCredential extends Credential {
  readonly protocol: string;
  readonly data: string | object;
}

export interface OpenId4VPDigitalCredential extends DigitalCredential {
  readonly protocol: 'openid4vp-v1-unsigned' | 'openid4vp-v1-signed' | 'openid4vp-v1-multisigned';
  readonly data: {
    response?: string
    error?: string
    error_description?: string
  };
}