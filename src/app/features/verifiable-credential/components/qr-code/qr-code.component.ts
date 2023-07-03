import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { DataService } from '@app/core/services/data.service';
import { PresentationDefinitionService } from '@app/core/services/presentation-definition.service';
import { ReplaySubject, Subject, interval, take, takeUntil } from 'rxjs';
import { NavigateService } from '@app/core/services/navigate.service';
import { environment } from '@environments/environment';
import { QRCodeModel } from '../../models/QRCodeModel';
import { PresentationDefinitionResponse } from '@app/core/models/presentation-definition-response';

declare let QRCode: new (arg0: HTMLElement | null, arg1: string) => QRCodeModel;

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
	constructor (
    private readonly presentationDefinitionService: PresentationDefinitionService,
    private readonly dataService: DataService,
    private readonly navigateService: NavigateService,
    private readonly changeDetectorRef: ChangeDetectorRef
	) {}

	ngOnDestroy (): void {
		this.destroy$.unsubscribe();
		this.dataService.setQRCode(null);
	}

	ngOnInit (): void {
		const data = this.dataService.QRCode as PresentationDefinitionResponse;

		if (!data) {
			this.navigateService.goHome();
		}
		this.displayJWTObject = false;
		this.displayButtonJWTObject = false;
		this.presentationDefinition = data;
		const qr = this.buildQrCode(data);
		new QRCode(document.getElementById('qrcode'), qr);
		this.pollingRequest(data.presentation_id,'nonce');
	}
	destroy$ = new Subject();
  @ViewChild('qrCode')	qrCode!: ElementRef;
  responseData = false;
  requestGenerate = false;
  hasResult = false;

  results!: string;
  JwtObject!: string;
  displayJWTObject = false;
  displayButtonJWTObject = false;

  presentationDefinition!: {
    client_id: string,
    request_uri: string
    presentation_id: string
  };

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
  					this.results = res;
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
}
