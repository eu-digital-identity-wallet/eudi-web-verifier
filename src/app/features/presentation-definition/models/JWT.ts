export type JWT = {
  'response_uri': string,
  'client_id_scheme': string,
  'response_type': string,
  'id_token_type': string,
  'nonce': string,
  'client_id': string,
  'response_mode': string,
  'aud': string,
  'scope': string,
  'presentation_definition': PresentationDefinition,
  'state': string,
  'iat': number
};

type PresentationDefinition = {
  'id': string,
  'input_descriptors': InputDescriptors[]
};

type InputDescriptors = {
  'id': string,
  'name': string,
  'purpose': string,
  'constraints': Constraints
};

type Constraints =
  {
    'fields': Fields[]
  };
type Fields = {
  'path': string[]
}
