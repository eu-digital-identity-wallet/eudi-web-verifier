export type WalletResponse = {
  id_token?: string;
  vp_token: { [id: string]: string[] };
}