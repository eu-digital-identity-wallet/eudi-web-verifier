export type WalletResponse = {
  vp_token: { [id: string]: string[] };
  error?: string;
  error_description?: string;
}