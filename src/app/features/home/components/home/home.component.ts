import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LayoutComponent } from '@app/core/layout/layout/layout.component';
import { DataService } from '@app/core/services/data.service';
import { NavigateService } from '@app/core/services/navigate.service';
import { OnlineAuthenticationSIOPService } from '@app/core/services/online-authentication-siop.service';
import { RadioGroupComponent } from '@app/shared/elements/radio-group/radio-group.component';
import { SharedModule } from '@app/shared/shared.module';

import * as cbor from 'cbor-js';

@Component({
	selector: 'vc-home',
	standalone: true,
	imports: [CommonModule, RadioGroupComponent, SharedModule, LayoutComponent],
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	providers: [OnlineAuthenticationSIOPService],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
	constructor (
    private navigateService: NavigateService,
    private readonly onlineAuthenticationSIOPService: OnlineAuthenticationSIOPService,
    private readonly dataService: DataService
	) {}
	ngOnInit (): void {
		this.decode(this.vpToken);
	}
	// eslint-disable-next-line max-len
	vpToken = 'o2d2ZXJzaW9uYzEuMGlkb2N1bWVudHOBo2dkb2NUeXBleBhldS5ldXJvcGEuZWMuZXVkaXcucGlkLjFsaXNzdWVyU2lnbmVkompuYW1lU3BhY2VzoXgYZXUuZXVyb3BhLmVjLmV1ZGl3LnBpZC4xkNgYWFikaGRpZ2VzdElEE2ZyYW5kb21QSmzzPZyCDv1T17NLxFK-onFlbGVtZW50SWRlbnRpZmllcmtmYW1pbHlfbmFtZWxlbGVtZW50VmFsdWVpQU5ERVJTU09O2BhYUaRoZGlnZXN0SUQEZnJhbmRvbVDqmfP2aA8nfl5TSHowY8m9cWVsZW1lbnRJZGVudGlmaWVyamdpdmVuX25hbWVsZWxlbWVudFZhbHVlY0pBTtgYWFykaGRpZ2VzdElEGBhmcmFuZG9tUJ1dU9F63fDU9XpbZ5IjMq5xZWxlbWVudElkZW50aWZpZXJqYmlydGhfZGF0ZWxlbGVtZW50VmFsdWXZA-xqMTk4NS0wMy0zMNgYWF6kaGRpZ2VzdElEDmZyYW5kb21QCU2SXHh-buWPbU6RMHcY73FlbGVtZW50SWRlbnRpZmllcnFmYW1pbHlfbmFtZV9iaXJ0aGxlbGVtZW50VmFsdWVpQU5ERVJTU09O2BhYV6RoZGlnZXN0SUQLZnJhbmRvbVDE-UnG_R9fklw8tMfXIQXOcWVsZW1lbnRJZGVudGlmaWVycGdpdmVuX25hbWVfYmlydGhsZWxlbWVudFZhbHVlY0pBTtgYWFWkaGRpZ2VzdElECmZyYW5kb21Q7aHFdl7agjf38513RbhjzHFlbGVtZW50SWRlbnRpZmllcmtiaXJ0aF9wbGFjZWxlbGVtZW50VmFsdWVmU1dFREVO2BhYZKRoZGlnZXN0SUQYGWZyYW5kb21QGVDZsN0X6o47yYU938bdR3FlbGVtZW50SWRlbnRpZmllcnByZXNpZGVudF9hZGRyZXNzbGVsZW1lbnRWYWx1ZW9GT1JUVU5BR0FUQU4gMTXYGFhcpGhkaWdlc3RJRAVmcmFuZG9tUDkVyImEeK9h7opQdhbeSDxxZWxlbWVudElkZW50aWZpZXJtcmVzaWRlbnRfY2l0eWxlbGVtZW50VmFsdWVrS0FUUklORUhPTE3YGFhdpGhkaWdlc3RJRBJmcmFuZG9tUF8F2eAL4JrvyQ0A5tBdfXpxZWxlbWVudElkZW50aWZpZXJ0cmVzaWRlbnRfcG9zdGFsX2NvZGVsZWxlbWVudFZhbHVlZTY0MTMz2BhYVKRoZGlnZXN0SUQMZnJhbmRvbVDm5aPBwr7FsyZX5k1nj2gRcWVsZW1lbnRJZGVudGlmaWVybnJlc2lkZW50X3N0YXRlbGVsZW1lbnRWYWx1ZWJTRdgYWFakaGRpZ2VzdElEAGZyYW5kb21Qi0eHxS49YJdz_yxPWTx3lnFlbGVtZW50SWRlbnRpZmllcnByZXNpZGVudF9jb3VudHJ5bGVsZW1lbnRWYWx1ZWJTRdgYWEqkaGRpZ2VzdElEA2ZyYW5kb21QDwYENdGWt-XUq7gi1iPEbHFlbGVtZW50SWRlbnRpZmllcmZnZW5kZXJsZWxlbWVudFZhbHVlAdgYWFGkaGRpZ2VzdElED2ZyYW5kb21Q4NMx_u8EloVTQkzjZ7GShXFlbGVtZW50SWRlbnRpZmllcmtuYXRpb25hbGl0eWxlbGVtZW50VmFsdWViU0XYGFhPpGhkaWdlc3RJRAJmcmFuZG9tUFE9zNuMOez7t6LQ5jnQVRBxZWxlbWVudElkZW50aWZpZXJrYWdlX292ZXJfMThsZWxlbWVudFZhbHVl9dgYWFGkaGRpZ2VzdElEFmZyYW5kb21Qa0Mdsk6zlTuKvl_ifh-rGXFlbGVtZW50SWRlbnRpZmllcmxhZ2VfaW5feWVhcnNsZWxlbWVudFZhbHVlGCbYGFhUpGhkaWdlc3RJRA1mcmFuZG9tUHVeV2RpUa1pvkam8EBOMHdxZWxlbWVudElkZW50aWZpZXJuYWdlX2JpcnRoX3llYXJsZWxlbWVudFZhbHVlGQfBamlzc3VlckF1dGiEQ6EBJqEYIVkChTCCAoEwggImoAMCAQICCRZK5ZkC3AUQZDAKBggqhkjOPQQDAjBYMQswCQYDVQQGEwJCRTEcMBoGA1UEChMTRXVyb3BlYW4gQ29tbWlzc2lvbjErMCkGA1UEAxMiRVUgRGlnaXRhbCBJZGVudGl0eSBXYWxsZXQgVGVzdCBDQTAeFw0yMzA1MzAxMjMwMDBaFw0yNDA1MjkxMjMwMDBaMGUxCzAJBgNVBAYTAkJFMRwwGgYDVQQKExNFdXJvcGVhbiBDb21taXNzaW9uMTgwNgYDVQQDEy9FVSBEaWdpdGFsIElkZW50aXR5IFdhbGxldCBUZXN0IERvY3VtZW50IFNpZ25lcjBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABHyTE_TBpKpOsLPraBGkmU5Z3meZZDHC864IjrehBhy2WL2MORJsGVl6yQ35nQeNPvORO6NL2yy8aYfQJ-mvnfyjgcswgcgwHQYDVR0OBBYEFNGksSQ5MvtFcnKZSPJSfZVYp00tMB8GA1UdIwQYMBaAFDKR6w4cAR0UDnZPbE_qTJY42vsEMA4GA1UdDwEB_wQEAwIHgDASBgNVHSUECzAJBgcogYxdBQECMB8GA1UdEgQYMBaGFGh0dHA6Ly93d3cuZXVkaXcuZGV2MEEGA1UdHwQ6MDgwNqA0oDKGMGh0dHBzOi8vc3RhdGljLmV1ZGl3LmRldi9wa2kvY3JsL2lzbzE4MDEzLWRzLmNybDAKBggqhkjOPQQDAgNJADBGAiEA3l-Y5x72V1ISa_LEuE_e34HSQ8pXsVvTGKq58evrP30CIQD-Ivcya0tXWP8W_obTOo2NKYghadoEm1peLIBqsUcISFkE1tgYWQTRpmd2ZXJzaW9uYzEuMG9kaWdlc3RBbGdvcml0aG1nU0hBLTI1Nmdkb2NUeXBleBhldS5ldXJvcGEuZWMuZXVkaXcucGlkLjFsdmFsdWVEaWdlc3RzoXgYZXUuZXVyb3BhLmVjLmV1ZGl3LnBpZC4xuBoAWCAxMjgJkpvspLKPMN-Pnty4oh4maG2wtTFoemKpj_m5lgFYIH1Zh6Dbdoa5uXkKnqkxeq9h6djxynaGjSNEiqjsfbqnAlggTPupXMvLYNCuUxRiJH6g5qXfcWJIZ3ksZdcBA3pRwVUDWCB09uPPCqgMuIAJjQn2YRgmBl_tT9_3E9e0Jt3wburrMQRYIKyhscjEnmppDBFnWXIexzJ6VA3qO_0O_28WUVZ7Do73BVggTnDM3Imck9Hyok1Bmq4AZppNorJD00rpxc5BcXL5DJIGWCAo2rB9bGnbf9Xk5SYW22eaR2gxf1fj8a5rvDrpg66_jgdYIGo9ozvjL4bMgj7DuocMDAW5625WzDTj_BYNkHWFtgWOCFgg33OYzqyvNX-DNFMfs2ylTqBLJLnd8Yrm-ifEwMKPOhcJWCC31ffovu9YfCMFuUG7bdA3aqLaAEslQSq3whIl2pftugpYIC871wTY0U5kzcdUgKT0-HU2vOQGK_R7xTYzMeHdNW-nC1ggOWtn_Y2bEeQPO-5c0ULn9SbuLqx3et9VPV_97W_4ak0MWCCfycCaJs0xNbn_hWILpaZFvND6lWlm0oWRXTr_fA3BeA1YIKh7sCAEOwZJgTTy8o1xKD3B3x377CyYJX60oNthxPOtDlggwlmw_3oWKQZuk5zZ6J3WqWs8CPUKBgqQ_-4iiQNi-Z8PWCDrLdImBO7FEZy6AOWUKiDZqCgLy3OIAbhL3r2saF_VQhBYIKfGo-N144iz-NMxZKBHRITm8nE0ehQLPYDjvyRZ9l4eEVggU--gmFBCsGFt4k9ok9OYq1x5yRudR2EI5aoypDqdo5gSWCDWNI6q2jc9agynYGJAcI2iNFmoBYtErVC0_M-gKmrGSBNYIJ7xfKUNEwKhWfOX7XepB-wbgTRbZvBaGWXLYNb3Gf9AFFgg5C3mvEIKHsvvRRew19IErl0H7LcjBuozBqiUAqgpkWUVWCDCgU5RvDr9vu213R4u8rPTZ7h8CiVBDGTnvwH4GOe7RhZYIPOVFTWGsQyS2tAEWHFmpBX0qA33YuedXUdCM_w4El-XF1ggpWkSSNUczHH0KlnfVMYGF91Nh1k4QWNpGBAJKWISthUYGFgg6QCJ07heChHShYpVlRM2H-FmFVTEH_TQPQn4ie44ZGMYGVggDxlSeoNAWC2gPtQRoGXudIsumxrSkV6vi9ePrJYLN_NtZGV2aWNlS2V5SW5mb6FpZGV2aWNlS2V5pAECIAEhWCBUnC7AtGRRpb0PMV3aoCWymw28qjrFbRp6khJkvPK5TSJYIIzHjsTwaoV-LlDUVbScnLjsn1Nqfs6iSqo5-J2FKtPxbHZhbGlkaXR5SW5mb6Nmc2lnbmVkwHQyMDIzLTA3LTEzVDE2OjA4OjQ1Wml2YWxpZEZyb23AdDIwMjMtMDctMTNUMTY6MDg6NDVaanZhbGlkVW50aWzAdDIwMjQtMDctMTNUMTY6MDg6NDVaWEAtug-r916DygJtBmo-uBWynnJDQXy0N7zre1jnDf4qnaRq8OZENCiEfG4Jiw9saECd84Y7BKXZpTK4j1J14dvObGRldmljZVNpZ25lZKJqbmFtZVNwYWNlc9gYQaBqZGV2aWNlQXV0aKFvZGV2aWNlU2lnbmF0dXJlhEOhASag9lhA_5-pTyCo_U85BsOkGlYkKtYJjWfWz0myI6Q6lRWI-qunvUb1Bd3aWYxod5Fx6_NLDJjqs4k0SCKHwLZDhBkIHmZzdGF0dXMA';
	navPath = '';
	disableButton = true;
	options = [{
		key: 'SIOP',
		value: 'Online Authentication  (SIOP)',
		isDisabled: false,
	},
	{
		key: 'OID4VP_CBOR',
		value: 'OID4VP + CBOR',
		isDisabled: false,
	},
	{
		key: 'OID4VP_C',
		value: 'OID4VP Custom',
		isDisabled: false,
	}
	];
	navigate (choose: string) {
		this.disableButton = false;
		if (choose === 'SIOP') {
			this.navPath = 'siop';
		} else if (choose === 'OID4VP_CBOR') {
			this.navPath = 'cbor';
		} else if (choose === 'OID4VP_C') {
			this.navPath = '/presentation';
		}

	}
	submit () {
		if (this.navPath === '/presentation') {
			this.navigateService.navigateTo(this.navPath);
		} else if (this.navPath === 'siop') {
			this.onlineAuthenticationSIOPService.initTransaction().subscribe((data) => {
				this.dataService.setQRCode(data);
				this.navigateService.navigateTo(this.navPath);
			});
		} else if(this.navPath === 'cbor') {
			this.onlineAuthenticationSIOPService.initCborTransaction().subscribe((data) => {
				this.dataService.setQRCode(data);
				this.navigateService.navigateTo(this.navPath);
			});
		}
	}

	decode (data: string) {
		const decoded = this.base64ToBinary(data);
		const parser = this.cborParser(decoded);
		console.log(parser);
		this.printPid(parser);
	}
	cborParser (binaryData: Uint8Array){
		return cbor.decode(binaryData);
	}
	private printPid (cborEncodedObject: any) {
		const issuerSignedArray = cborEncodedObject.documents[0].issuerSigned.nameSpaces['eu.europa.ec.eudiw.pid.1'];
		for (let i = 0; i < issuerSignedArray.length; i++) {
			console.log(cbor.decode(issuerSignedArray[i].buffer));
			// this.printPid(this.cborParser(issuerSignedArray[i].buffer));
		}
	}

	private base64ToBinary (base64String: string): any {
		// const URlDecoded = btoa(base64String);
		// console.log('URlDecoded', URlDecoded);

		const binaryString = this.base64URLDecode(base64String);
		const binaryData = new Uint8Array(binaryString.length);

		for (let i = 0; i < binaryString.length; i++) {
			binaryData[i] = binaryString.charCodeAt(i);
		}
		console.log('binaryData', binaryData);
		return binaryData.buffer;
	}

	private base64URLDecode (input: any) {
		// Replace non-url compatible chars with base64 standard chars
		let output = input
			.replace(/-/g, '+')
			.replace(/_/g, '/');


		// Pad out with standard base64 required padding characters
		const pad = input.length % 4;
		if(pad) {
			if(pad === 1) {
				throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
			}
			output += new Array(5-pad).join('=');
		}


		return atob(output);
	}

	// private Utf8ArrayToStr (array: Utf8Array) {
	// 	let out, i, len, c;
	// 	let char2, char3;

	// 	out = '';
	// 	len = array.length;
	// 	i = 0;
	// 	while(i < len) {
	// 		c = array[i++];
	// 		switch(c >> 4)
	// 		{
	// 		case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
	// 			// 0xxxxxxx
	// 			out += String.fromCharCode(c);
	// 			break;
	// 		case 12: case 13:
	// 			// 110x xxxx   10xx xxxx
	// 			char2 = array[i++];
	// 			out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
	// 			break;
	// 		case 14:
	// 			// 1110 xxxx  10xx xxxx  10xx xxxx
	// 			char2 = array[i++];
	// 			char3 = array[i++];
	// 			out += String.fromCharCode(((c & 0x0F) << 12) |
  //                      ((char2 & 0x3F) << 6) |
  //                      ((char3 & 0x3F) << 0));
	// 			break;
	// 		}
	// 	}
  //   console.log(out);
	// }
}
