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

  results!: any;
  CBORResults!: any;
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
  				(res: any) =>{
  						if (this.router.url.includes('cbor')) {
  							this.CBORResults = res.vp_token_decoded;
  						} else {
  							this.results = res;
  						}
  						const divElement = this.qrCode.nativeElement;
  						divElement.style.display='none';
  						this.hasResult = true;
  						this.changeDetectorRef.detectChanges();
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

  ngOnDestroy (): void {
  	this.destroy$.unsubscribe();
  	this.dataService.setQRCode(null);
  }
}
