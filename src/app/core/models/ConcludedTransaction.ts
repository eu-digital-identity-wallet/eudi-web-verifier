import {WalletResponse} from "@core/models/WalletResponse";
import {PresentationDefinition} from "@core/models/presentation/PresentationDefinition";

export type ConcludedTransaction = {
  transactionId: string,
  presentationDefinition: PresentationDefinition,
  walletResponse: WalletResponse,
  nonce: string
}
