import { TypeOfColor } from '../../button/enums/type-of-color';
import { ActionCode } from './ActionCode';

export type BodyAction = {
  label: string,
  disabled: boolean,
  id: string,
  mode: string,
  color: TypeOfColor,
  order: number,
  code: ActionCode
}
