import { CredentialQuery } from '@app/core/models/dcql/DCQL';
import { InputDescriptor } from '@app/core/models/presentation/InputDescriptor';

export type AttributesSelectionEvent = {
  inputDescriptors: InputDescriptor[];
  dcqlQueries: CredentialQuery[];
};
