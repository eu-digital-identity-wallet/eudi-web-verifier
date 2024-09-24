import { PresentationDefinition } from './presentation/PresentationDefinition';

export type TransactionInitializationRequest = {
   type: string,
	 presentation_definition: PresentationDefinition,
   nonce: string
}
