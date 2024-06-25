import { Constraint } from './Constraint';

export type InputDescriptors = {
  id: string,
  name: string,
  purpose: string,
  format: Format,
  constraints: Constraint
}

type Format = {
  mso_mdoc: {
    alg: string[]
  }
}
