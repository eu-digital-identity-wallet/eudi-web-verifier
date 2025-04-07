import {PresentationDefinition} from './presentation/PresentationDefinition';
import {RegistrationData} from "@features/presentation-request-preparation/home/home.component";

export type TransactionInitializationRequest = {
  type: string,
  presentation_definition: PresentationDefinition,
  nonce: string,
  registration_data?: RegistrationData,
}
