import { Constraint } from './Constraint';

export type InputDescriptors = {
  id: string,
  name?: string,
  purpose?: string,
  format?: Format,
  constraints: Constraint
}

type Format = {
  jwt_vc_json?: {
    proof_type: string[]
  },
  mso_mdoc?: {
    alg: string[]
  }
}
