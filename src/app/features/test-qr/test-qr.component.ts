import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletLayoutComponent } from '@app/core/layout/wallet-layout/wallet-layout.component';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let QRCode: any;

@Component({
	selector: 'vc-test-qr',
	standalone: true,
	imports: [CommonModule, WalletLayoutComponent],
	templateUrl: './test-qr.component.html',
	styleUrls: ['./test-qr.component.scss']
})
export class TestQrComponent implements OnInit {

	testURL = 'http://localhost:4200/?client_id=Verifier&request_uri=eudi-openid4vp://eudi.netcompany-intrasoft.com/wallet/request.jwt/CUkGxi8NhQMwL1hPPZI0wdxj0x7c2Qi_zeOnrZoa5JO824VxZAaqZmdy2HreI5lPINr6cp4BnkdXPVD7D7ot_w';
	testURL1 = 'http://localhost:4200?client_id=Verifier&request_uri=http%3A%2F%2Flocalhost%3A8080%2Fwallet%2Frequest.jwt%2F3WrKzPt1gWJwVAmWaMECW5Mrse5RaHGi50Y7PeLhzZhbJIr6JJFO84i27B0CIFLZkxB8ELVI0IUt1YecnOs19g';
	ngOnInit (): void {
  	this.setUpQrCode1(this.testURL1);
  	this.setUpQrCode2(this.testURL1);
	}

	setUpQrCode1 (qr: string) {
  	new QRCode(document.getElementById('qrcode1'), {
  		text: qr,
  		correctLevel: QRCode.CorrectLevel.L,
  	});
	}
	setUpQrCode2 (qr: string) {
  	new QRCode(document.getElementById('qrcode2'), {
  		text: qr,
  		colorDark : '#F5F5F5',
  		colorLight : '#5a11df',
  		correctLevel: QRCode.CorrectLevel.L,
  	});
	}
}
