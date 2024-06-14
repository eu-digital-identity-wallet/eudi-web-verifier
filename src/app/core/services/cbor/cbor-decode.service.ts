import { Injectable } from '@angular/core';
import { from, Observable, mergeMap, forkJoin} from 'rxjs';
import { map } from 'rxjs/operators';
import { Buffer } from 'buffer';
import bdec from 'cbor-bigdecimal';
import * as cbor from 'cbor-web';
import { KeyValue } from '@angular/common';
import { TagValue } from '@app/core/models/CBOR';

bdec(cbor);

@Injectable()
export class CborDecodeService {

	decode (vpToken: string): Observable<KeyValue<string, string>[]> {
		const buf = Buffer.from(vpToken, 'base64');
		return from(cbor.decodeFirst(buf, {
			bigint: true,
			preferWeb: true
		}))
			.pipe(
				map((valueOut: any) => valueOut.documents[0].issuerSigned.nameSpaces.entries().next().value ),
				map((dataArray: TagValue[]) => {
					const requestData: any[] = [];
					dataArray.forEach((item: TagValue) => {
						requestData.push(this.cborDecode(item.value));
					});
					return requestData;
				}),
				map((valueOut: any) => valueOut),
				mergeMap(
					(data: Observable<any>) =>
						forkJoin(data)
							.pipe(
								map(
									(items) =>
										items.map((item: { elementIdentifier: string, elementValue: string}) =>
										{ return { key: item.elementIdentifier.replaceAll('_', ' '), value: item.elementValue}; })
								),
							)
				),
			);
	}
	cborDecode (buf: Uint8Array): Observable<any> {
		return from(cbor.decodeFirst(buf, {
			bigint: true,
			preferWeb: true
		}));
	}
}
