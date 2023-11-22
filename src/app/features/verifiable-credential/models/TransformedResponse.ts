import { KeyValue } from '@angular/common';

export type TransformedResponse = {
  idToken: KeyValue<string, string>[]
  vpToken: KeyValue<string, string>[]
}
