import {WalletResponse} from "@core/models/WalletResponse";
import {PresentationDefinition} from "@core/models/presentation/PresentationDefinition";
import {RegistrationData} from "@features/presentation-request-preparation/home/home.component";

export type ConcludedTransaction = {
  transactionId: string,
  presentationDefinition: PresentationDefinition,
  registrationData?: RegistrationData,
  walletResponse: WalletResponse
}
