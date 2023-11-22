import { DefinitionPath } from '@app/features/siop-custom/models/DefinitionPath';

export type CBORField = {
  id: number,
  label: string,
  path: string,
  value: DefinitionPath
}
