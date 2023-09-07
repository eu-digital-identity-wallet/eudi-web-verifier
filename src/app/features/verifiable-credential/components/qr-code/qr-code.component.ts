import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { DataService } from '@app/core/services/data.service';
import { PresentationDefinitionService } from '@app/core/services/presentation-definition.service';
import { ReplaySubject, Subject, interval, take, takeUntil } from 'rxjs';
import { NavigateService } from '@app/core/services/navigate.service';
import { environment } from '@environments/environment';
import { PresentationDefinitionResponse } from '@app/core/models/presentation-definition-response';

import * as cbor from 'cbor-js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let QRCode: any;

@Component({
	selector: 'vc-qr-code',
	standalone: true,
	imports: [CommonModule, SharedModule],
	templateUrl: './qr-code.component.html',
	styleUrls: ['./qr-code.component.scss'],
	providers: [PresentationDefinitionService],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class QrCodeComponent implements OnInit, OnDestroy {

	destroy$ = new Subject();
  @ViewChild('qrCode')	qrCode!: ElementRef;
  hasResult = false;

  results!: string;
  JwtObject!: string;
  displayButtonJWTObject = false;
  presentationDefinition!: PresentationDefinitionResponse;

  redirectUrl!: string;
  constructor (
    private readonly presentationDefinitionService: PresentationDefinitionService,
    private readonly dataService: DataService,
    private readonly navigateService: NavigateService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly router: Router,
  ) {}

  ngOnInit (): void {
  	this.presentationDefinition = this.dataService.QRCode as PresentationDefinitionResponse;

  	if (!this.presentationDefinition) {
  		this.navigateService.goHome();
  	}
  	this.displayButtonJWTObject = false;
  	const qr = this.buildQrCode(this.presentationDefinition);
  	this.redirectUrl = qr.replace('https', 'mdoc-openid4vp');

  	new QRCode(document.getElementById('qrcode'), {
  		text: qr,
  		correctLevel: QRCode.CorrectLevel.L
  	});
  	this.pollingRequest(this.presentationDefinition.presentation_id,'nonce');
  }

  pollingRequest (presentation_id: string, nonce: string) {
  	const source = interval(2000);
  	const stopPlay$ = new ReplaySubject(1);
  	source
  		.pipe(
  			takeUntil(stopPlay$),
  			take(60)
  		)
  		.subscribe(() => {
  		this.presentationDefinitionService.getWalletResponse(presentation_id,nonce).
  				pipe(takeUntil(this.destroy$))
  				.subscribe(
  				res =>{
            console.log(this.router.url.includes('cbor'));
  						if (this.router.url.includes('cbor')) {
  							this.convertToCbor(res);
  						} else {
  							this.results = res;
  							const divElement = this.qrCode.nativeElement;
  							divElement.style.display='none';
  							this.hasResult = true;
  							this.changeDetectorRef.detectChanges();
  						}
  						stopPlay$.next(1);
  				},
  			);
  		});
  }

  async copyToClipboard () {
  	try {
  		await navigator.clipboard.writeText(this.buildQrCode(this.presentationDefinition));
  	} catch (err) {
  		console.error('Failed to copy: ', err);
  	}
  }
  private buildQrCode (data: {client_id: string, request_uri: string, presentation_id: string}): string {
  	return `${environment.apiUrl}?client_id=${data.client_id}&request_uri=${data.request_uri}`;
  }

  goToLink (url: string) {
  	window.open(url, '_blank');
  }

  // @ts-ignore
  convertToCbor (res) {
  	const binaryData = this.base64ToBinary(res.vp_token);

  	const cborEncodedObject = this.cborParser(binaryData);

    this.printPid(cborEncodedObject);

  	this.results = cborEncodedObject;
  	this.hasResult = true;
  	const divElement = this.qrCode.nativeElement;
  	divElement.style.display='none';
  	this.changeDetectorRef.detectChanges();
  	console.log(cborEncodedObject);
  }

  private printPid(cborEncodedObject: any) {
    let issuerSignedArray = cborEncodedObject.documents[0].issuerSigned.nameSpaces["eu.europa.ec.eudiw.pid.1"];
    for (let i = 0; i < issuerSignedArray.length; i++) {
      console.log(this.cborParser(issuerSignedArray[i].buffer));
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
  	let	output = input
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

  cborParser (binaryData: Uint8Array){
  	return cbor.decode(binaryData);
  }

  ngOnDestroy (): void {
  	this.destroy$.unsubscribe();
  	this.dataService.setQRCode(null);
  }
}
