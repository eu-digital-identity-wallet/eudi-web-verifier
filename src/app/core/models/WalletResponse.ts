import { PresentationSubmission } from '@core/models/presentation/PresentationSubmission';

export type WalletResponse = {
  id_token?: string;
} & (DCQLWalletResponse | PrExWalletResponse);

export type DCQLWalletResponse = {
  vp_token: { [id: string]: string };
};

export type PrExWalletResponse = {
  vp_token: string[];
  presentation_submission: PresentationSubmission;
};
