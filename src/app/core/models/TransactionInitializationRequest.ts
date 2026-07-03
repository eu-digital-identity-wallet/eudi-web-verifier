import { DefaultProfile, DefaultRequestUriMethod } from '../constants/general';
import { DCQL } from './dcql/DCQL';

export type RequestUriMethod = 'get' | 'post' | 'post_get';
export type Profile = 'haip' | 'openid4vp';
export type ProfileOptions = {
  endpoint: string;
};
export const profileOptions: Record<Profile, ProfileOptions> = {
  haip: {
    endpoint: 'haip-vp://',
  },
  openid4vp: {
    endpoint: 'openid4vp://',
  },
};
export type PresentationQuery = DCQL;

export type DCApiRequestType = 'unsigned' | 'signed' | 'multisigned';

export type TransactionInitializationRequest =
  | RedirectsTransactionInitializationRequest
  | DCApiTransactionInitializationRequest;
export type RedirectsTransactionInitializationRequest = {
  nonce: string;
  dcql_query: DCQL;
  issuer_chain?: string;
  profile: Profile;
  request_uri_method: RequestUriMethod;
  authorization_request_uri: string;
};
export type DCApiTransactionInitializationRequest = {
  nonce: string;
  dcql_query: DCQL;
  issuer_chain?: string;
  origin: string;
  expected_origins?: string[];
};

export type RedirectsPresentationOptions = {
  profile: Profile;
  requestUriMethod: RequestUriMethod;
  authorizationRequestUri: string;
};
export const DefaultRedirectsPresentationOptions: RedirectsPresentationOptions =
  {
    profile: DefaultProfile,
    requestUriMethod: DefaultRequestUriMethod,
    authorizationRequestUri: profileOptions[DefaultProfile].endpoint,
  };

export type DCApiPresentationOptions = {
  expected_origins?: string[]
};
export const DefaultDCApiPresentationOptions: DCApiPresentationOptions = {
  expected_origins: [window.location.origin]
};
