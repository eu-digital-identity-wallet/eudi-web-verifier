import {WalletResponse} from "@core/models/WalletResponse";
import { PresentationQuery } from "./TransactionInitializationRequest";

export type ConcludedTransaction = {
  transactionId: string,
  presentationQuery: PresentationQuery,
  walletResponse: WalletResponse,
  nonce: string
}
